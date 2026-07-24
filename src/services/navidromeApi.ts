const SERVER_IP = process.env.EXPO_PUBLIC_SERVER_IP; 
const BASE_URL = `${SERVER_IP}/rest`;

const ADMIN_USER = process.env.EXPO_PUBLIC_NAVIDROME_USER;
const ADMIN_PASS = process.env.EXPO_PUBLIC_NAVIDROME_PASS;

let activeUser = '';
let activePass = '';

const CLIENT = 'AuraHiFi';
const VERSION = '1.17.1';

export const setNavidromeCredentials = (user: string, pass: string) => {
    activeUser = user;
    activePass = pass;
};

export const buildUrl = (endpoint: string, extraParams: Record<string, any> = {}) => {
    if (!activeUser || !activePass) {
        console.warn("⚠️ Intentando hacer una petición sin sesión activa.");
    }

    let url = `${BASE_URL}/${endpoint}?u=${encodeURIComponent(activeUser)}&p=${encodeURIComponent(activePass)}&v=${VERSION}&c=${encodeURIComponent(CLIENT)}&f=json`;
    
    Object.entries(extraParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url += `&${key}=${encodeURIComponent(String(value))}`;
        }
    });
    
    return url;
};

// 2. NUESTRO ATRAPA-ERRORES PARA DEPURACIÓN
export const fetchFromNavidrome = async (url: string) => {
    const response = await fetch(url);
    const text = await response.text(); 
    try {
        return JSON.parse(text); 
    } catch (error) {
        console.error(`🚨 ERROR DEL NAS AL LLAMAR A: ${url.split('?')[0]}`);
        console.error(`🚨 EL NAS RESPONDIÓ ESTO: ${text}`); 
        throw error;
    }
};

// 3. TODAS LAS INTERFACES REQUERIDAS
export interface Track {
    id: string;
    title: string;
    artist: string;
    artistId?: string;
    album: string;
    duration: number;
    coverArtUrl: string;
    streamUrl: string;
    starred?: boolean; 
}

export interface Album {
    id: string;
    title: string;
    artist: string;
    coverArtUrl: string;
    year?: number;
}

export interface Playlist {
    id: string;
    title: string;
    owner?: string;
    coverArtUrl: string;
    trackCount?: number;
    duration?: number;
}

export interface Artist {
    id: string;
    name: string;
    albumCount?: number;
    artistImageUrl?: string;
}

// 4. EL MOTOR EXPORTADO DE LA API
export const navidromeApi = {

    // ------------------------------------------------------------------
    // TUS FUNCIONES ANTIGUAS (Motor del Player, Home y Letras)
    // ------------------------------------------------------------------
    createUser: async (newUsername: string, newPass: string, newName: string, newEmail: string): Promise<boolean> => {
        try {
            const ADMIN_USER = process.env.EXPO_PUBLIC_NAVIDROME_USER || '';
            const ADMIN_PASS = process.env.EXPO_PUBLIC_NAVIDROME_PASS || '';
            const SERVER_IP = process.env.EXPO_PUBLIC_SERVER_IP;

            // PASO 1: Iniciar sesión en la API Nativa para obtener un Token JWT de Administrador
            const authResponse = await fetch(`${SERVER_IP}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username: ADMIN_USER, 
                    password: ADMIN_PASS 
                })
            });

            if (!authResponse.ok) {
                console.error("⚠️ Falló la autenticación del Admin en la API Nativa");
                return false;
            }

            const authData = await authResponse.json();
            const token = authData.token;

            // PASO 2: Usar el Token para crear el usuario con los datos reales
            const createUserResponse = await fetch(`${SERVER_IP}/api/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-nd-authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userName: newUsername,           // ID Técnico para loguearse
                    name: newName,                   // Nombre a mostrar en la interfaz
                    email: newEmail,                 // Correo real
                    password: newPass,               
                    isAdmin: false                   // Permisos de usuario regular
                })
            });

            if (!createUserResponse.ok) {
                const errorText = await createUserResponse.text();
                console.error("⚠️ Navidrome rechazó la creación:", errorText);
                return false;
            }

            return true;
        } catch (error) {
            console.error("Error crítico creando usuario nativo:", error);
            return false;
        }
    },

    mapSongsToTrack: (songs: any[], query: string): Track[] => {
        return songs.map((song: any) => ({
            id: song.id,
            title: song.title,
            artist: song.artist,
            album: song.album,
            duration: song.duration,
            coverArtUrl: buildUrl('getCoverArt', { id: song.coverArt || song.albumId || song.id, size: 300 }),
            streamUrl: buildUrl('stream', { id: song.id }),
            starred: song.starred !== undefined
        }));
    },

    getAllTracks: async (limit: number = 50): Promise<Track[]> => {
        const url = buildUrl('getRandomSongs', { size: limit });
        const data = await fetchFromNavidrome(url);
        const songs = data['subsonic-response']?.randomSongs?.song || [];
        return navidromeApi.mapSongsToTrack(songs, 'getRandomSongs');
    },

    toggleFavorite: async (id: string): Promise<void> => {
        // Lo dejamos por si tienes algún botón viejo que dependa de esto sin devolver booleano
        const url = buildUrl('star', { id });
        await fetchFromNavidrome(url);
    },

    getStarredTracks: async (): Promise<Track[]> => {
        const url = buildUrl('getStarred');
        const data = await fetchFromNavidrome(url);
        const songs = data['subsonic-response']?.starred?.song || [];
        return navidromeApi.mapSongsToTrack(songs, 'getStarred');
    },

    getStarredArtists: async (): Promise<Artist[]> => {
        const url = buildUrl('getStarred');
        const data = await fetchFromNavidrome(url);
        // Navidrome agrupa los favoritos en .song, .album y .artist
        const artists = data['subsonic-response']?.starred?.artist || [];
        
        return artists.map((a: any) => ({
            id: a.id,
            name: a.name,
            albumCount: a.albumCount,
            artistImageUrl: a.artistImageUrl
        }));
    },

    getAlbumTracks: async (albumId: string): Promise<Track[]> => {
        const url = buildUrl('getAlbum', { id: albumId });
        const data = await fetchFromNavidrome(url);
        const songs = data['subsonic-response']?.album?.song || [];
        return navidromeApi.mapSongsToTrack(songs, 'getAlbum');
    },

    getPlaylistTracks: async (playlistId: string): Promise<Track[]> => {
        const url = buildUrl('getPlaylist', { id: playlistId });
        const data = await fetchFromNavidrome(url);
        const songs = data['subsonic-response']?.playlist?.entry || [];
        return navidromeApi.mapSongsToTrack(songs, 'getPlaylist');
    },

    getArtists: async (): Promise<Artist[]> => {
        const url = buildUrl('getArtists');
        const data = await fetchFromNavidrome(url);
        const artistsList: Artist[] = [];

        // Navidrome devuelve los artistas agrupados por letra (A, B, C...)
        const indexArray = data['subsonic-response']?.artists?.index || [];
        const indices = Array.isArray(indexArray) ? indexArray : [indexArray];

        indices.forEach((indexNode: any) => {
            if (indexNode.artist) {
                const artistsInLetter = Array.isArray(indexNode.artist) ? indexNode.artist : [indexNode.artist];
                artistsInLetter.forEach((a: any) => {
                    artistsList.push({
                        id: a.id,
                        name: a.name,
                        albumCount: a.albumCount,
                        // Nota: Subsonic a veces no manda imagen directa aquí, lo manejaremos en la vista
                        artistImageUrl: a.artistImageUrl 
                    });
                });
            }
        });
        
        return artistsList;
    },

    getArtistDetails: async (artistId: string, artistName?: string) => {
        const artistUrl = buildUrl('getArtist', { id: artistId });
        const infoUrl = buildUrl('getArtistInfo2', { id: artistId });

        // Hacemos las peticiones iniciales en paralelo
        const [artistRes, infoRes] = await Promise.all([
            fetchFromNavidrome(artistUrl).catch(() => null),
            fetchFromNavidrome(infoUrl).catch(() => null),
        ]);
        
        let artist = artistRes?.['subsonic-response']?.artist;
        let albums = artist?.album || [];
        let info = infoRes?.['subsonic-response']?.artistInfo2;

        // 🚀 EL SECRETO: Si la canción del Modal no nos mandó el nombre, lo extraemos a la fuerza de la biografía o de la base
        const resolvedName = artistName || artist?.name || info?.name || info?.artist;

        // 🛡️ PLAN B: Es un ID de Carpeta de Archivos
        if (!artist) {
            console.log("⚠️ getArtist falló. Intentando extraer por directorio...");
            const directoryUrl = buildUrl('getMusicDirectory', { id: artistId });
            const dirRes = await fetchFromNavidrome(directoryUrl).catch(() => null);
            
            const directory = dirRes?.['subsonic-response']?.directory;
            if (directory) {
                artist = {
                    id: directory.id,
                    name: directory.name || resolvedName,
                    albumCount: directory.child?.length || 0,
                    artistImageUrl: undefined
                };
                albums = directory.child || []; 
            }
        }

        // 🚀 PLAN C: "GHOST ID" (Búsqueda y Rescate)
        // Ahora usamos "resolvedName", por lo que NUNCA fallará aunque el Modal venga vacío
        if (!artist && resolvedName) {
            console.log(`📡 ID Fantasma detectado. Rescatando maestro por nombre: ${resolvedName}`);
            const searchUrl = buildUrl('search3', { query: resolvedName, artistCount: 1 });
            const searchRes = await fetchFromNavidrome(searchUrl).catch(() => null);
            
            const foundArtist = searchRes?.['subsonic-response']?.searchResult3?.artist?.[0];
            
            if (foundArtist) {
                console.log(`✅ Artista Maestro encontrado: ${foundArtist.name}`);
                const trueArtistUrl = buildUrl('getArtist', { id: foundArtist.id });
                const trueArtistRes = await fetchFromNavidrome(trueArtistUrl).catch(() => null);
                
                artist = trueArtistRes?.['subsonic-response']?.artist || foundArtist;
                albums = artist?.album || [];
                
                const trueInfoUrl = buildUrl('getArtistInfo2', { id: foundArtist.id });
                const trueInfoRes = await fetchFromNavidrome(trueInfoUrl).catch(() => null);
                info = trueInfoRes?.['subsonic-response']?.artistInfo2 || info;
            }
        }

        if (!artist) throw new Error("Artista no encontrado en la base de datos.");

        // Ahora sí, con el artista asegurado, pedimos las 5 canciones más populares
        const topSongsUrl = buildUrl('getTopSongs', { artist: artist.name || resolvedName, count: 5 });
        const topSongsRes = await fetchFromNavidrome(topSongsUrl).catch(() => null);
        const topSongs = topSongsRes?.['subsonic-response']?.topSongs?.song || [];

        return {
            id: artist.id,
            name: artist.name || resolvedName,
            albumCount: artist.albumCount,
            artistImageUrl: info?.largeImageUrl || artist.artistImageUrl || undefined,
            biography: info?.biography ? info.biography.replace(/<[^>]*>?/gm, '') : 'Biografía no disponible en el servidor.',
            
            topTracks: topSongs.map((song: any) => ({
                id: song.id,
                title: song.title,
                artist: song.artist,
                artistId: song.artistId,  // 🚀 Asegurado
                album: song.album,
                albumId: song.albumId,    // 🚀 Asegurado
                duration: song.duration,
                coverArtUrl: buildUrl('getCoverArt', { id: song.coverArt || song.albumId || song.id, size: 300 }),
                streamUrl: buildUrl('stream', { id: song.id })
            })),

            albums: albums.map((album: any) => ({
                id: album.id,
                title: album.name || album.title,
                artist: artist.name || resolvedName,
                year: album.year,
                coverArtUrl: buildUrl('getCoverArt', { id: album.id, size: 300 })
            }))
        };
    },

    // ------------------------------------------------------------------
    // NUEVAS FUNCIONES PARA LA BIBLIOTECA Y LOS DETALLES
    // ------------------------------------------------------------------
    
    getRecentAlbums: async (limit: number = 10): Promise<Album[]> => {
        const url = buildUrl('getAlbumList2', { type: 'newest', size: limit });
        const data = await fetchFromNavidrome(url);
        
        const albums = data['subsonic-response']?.albumList2?.album || [];
        return albums.map((album: any) => ({
            id: album.id,
            title: album.name || album.title || 'Álbum Desconocido',
            artist: album.artist || 'Artista Desconocido',
            year: album.year,
            coverArtUrl: buildUrl('getCoverArt', { id: album.id, size: 300 })
        }));
    },

    getAllAlbums: async (limit: number = 50, offset: number = 0): Promise<Album[]> => {
        const url = buildUrl('getAlbumList2', { type: 'alphabeticalByName', size: limit, offset });
        const data = await fetchFromNavidrome(url);
        
        const albums = data['subsonic-response']?.albumList2?.album || [];
        return albums.map((album: any) => ({
            id: album.id,
            title: album.name || album.title || 'Álbum Desconocido',
            artist: album.artist || 'Artista Desconocido',
            year: album.year,
            coverArtUrl: buildUrl('getCoverArt', { id: album.id, size: 300 })
        }));
    },

    getPlaylists: async (): Promise<Playlist[]> => {
        const url = buildUrl('getPlaylists');
        const data = await fetchFromNavidrome(url);
        
        const playlists = data['subsonic-response']?.playlists?.playlist || [];
        return playlists.map((p: any) => ({
            id: p.id,
            title: p.name,
            owner: p.owner,
            trackCount: p.songCount,
            coverArtUrl: buildUrl('getCoverArt', { id: p.coverArt || p.id, size: 300 }) 
        }));
    },

    getAlbumDetails: async (albumId: string) => {
        const url = buildUrl('getAlbum', { id: albumId });
        const data = await fetchFromNavidrome(url);
        
        const album = data['subsonic-response']?.album;
        if (!album) throw new Error("Álbum no encontrado");

        return {
            id: album.id,
            title: album.name || album.title,
            artist: album.artist,
            artistId: album.artistId,
            coverArtUrl: buildUrl('getCoverArt', { id: album.id, size: 500 }),
            year: album.year,
            songCount: album.songCount,
            totalDuration: album.duration,
            // AGREGAMOS ESTA LINEA PARA EXPORTAR EL ESTADO DEL LIKE
            starred: album.starred !== undefined,
            tracks: (album.song || []).map((song: any) => ({
                id: song.id,
                title: song.title,
                artist: song.artist,
                artistId: song.artistId,
                album: song.album,
                duration: song.duration,
                starred: song.starred !== undefined,
                artwork: buildUrl('getCoverArt', { id: song.coverArt || song.albumId || song.id, size: 300 }),
                url: buildUrl('stream', { id: song.id })
            }))
        };
    },

    getPlaylistDetails: async (playlistId: string) => {
        const url = buildUrl('getPlaylist', { id: playlistId });
        const data = await fetchFromNavidrome(url);
        
        const playlist = data['subsonic-response']?.playlist;
        if (!playlist) throw new Error("Playlist no encontrada");

        return {
            id: playlist.id,
            title: playlist.name,
            owner: playlist.owner,
            coverArtUrl: buildUrl('getCoverArt', { id: playlist.coverArt || playlist.id, size: 500 }),
            songCount: playlist.songCount,
            totalDuration: playlist.duration,
            // AGREGAMOS ESTA LINEA
            starred: playlist.starred !== undefined,
            tracks: (playlist.entry || []).map((song: any) => ({
                id: song.id,
                title: song.title,
                artist: song.artist,
                album: song.album,
                albumId: song.albumId,
                duration: song.duration,
                starred: song.starred !== undefined,
                artwork: buildUrl('getCoverArt', { id: song.coverArt || song.albumId || song.id, size: 300 }),
                url: buildUrl('stream', { id: song.id })
            }))
        };
    },

    // 🚀 Para la sección de "Tendencias" (Lo que más escuchas)
    getFrequentAlbums: async (limit: number = 6): Promise<Album[]> => {
        const url = buildUrl('getAlbumList2', { type: 'frequent', size: limit });
        const data = await fetchFromNavidrome(url).catch(() => null);
        
        const albums = data?.['subsonic-response']?.albumList2?.album || [];
        return albums.map((album: any) => ({
            id: album.id,
            title: album.name || album.title || 'Álbum Desconocido',
            artist: album.artist || 'Artista Desconocido',
            year: album.year,
            coverArtUrl: buildUrl('getCoverArt', { id: album.id, size: 300 })
        }));
    },

    // 🚀 Para la sección "Descubre" (Álbumes aleatorios del servidor)
    getRandomAlbums: async (limit: number = 10): Promise<Album[]> => {
        const url = buildUrl('getAlbumList2', { type: 'random', size: limit });
        const data = await fetchFromNavidrome(url).catch(() => null);
        
        const albums = data?.['subsonic-response']?.albumList2?.album || [];
        return albums.map((album: any) => ({
            id: album.id,
            title: album.name || album.title || 'Álbum Desconocido',
            artist: album.artist || 'Artista Desconocido',
            year: album.year,
            coverArtUrl: buildUrl('getCoverArt', { id: album.id, size: 300 })
        }));
    },

    toggleStar: async (id: string, isStarred: boolean, type: 'track' | 'album' | 'artist' = 'track') => {
        const endpoint = isStarred ? 'unstar' : 'star';
        
        // 🚀 Construimos el parámetro correcto según lo que estemos guardando
        const params: Record<string, string> = {};
        if (type === 'album') {
            params.albumId = id;
        } else if (type === 'artist') {
            params.artistId = id;
        } else {
            params.id = id; // Por defecto (canciones) usa 'id'
        }
        
        const url = buildUrl(endpoint, params);
        await fetchFromNavidrome(url);
        return !isStarred; 
    },

    getRandomSongs: async (count: number = 10) => {
        const url = buildUrl('getRandomSongs', { size: count });
        const response = await fetchFromNavidrome(url).catch(() => null);
        
        const songs = response?.['subsonic-response']?.randomSongs?.song || [];
        
        return songs.map((song: any) => ({
            id: song.id,
            title: song.title,
            artist: song.artist,
            album: song.album,
            duration: song.duration,
            coverArtUrl: buildUrl('getCoverArt', { id: song.coverArt || song.albumId || song.id, size: 300 }),
            streamUrl: buildUrl('stream', { id: song.id })
        }));
    },
    
    getSimilarSongs: async (songId: string, limit: number = 10): Promise<Track[]> => {
        // Usamos getSimilarSongs2 que es más preciso en Subsonic/Navidrome
        const url = buildUrl('getSimilarSongs2', { id: songId, count: limit });
        const response = await fetchFromNavidrome(url).catch(() => null);
        
        const songs = response?.['subsonic-response']?.similarSongs2?.song || [];
        
        // Usamos tu mapeador existente para que devuelva el formato Track correcto
        return navidromeApi.mapSongsToTrack(songs, 'getSimilarSongs');
    },
    
    updatePlaylist: async (playlistId: string, name: string) => {
        const url = buildUrl('updatePlaylist', { playlistId, name });
        const data = await fetchFromNavidrome(url);
        return data['subsonic-response'].status === 'ok';
    },

    searchTracks: async (query: string, limit: number = 20): Promise<Track[]> => {
        if (!query.trim()) return [];
        
        try {
            // search3 busca en todo el servidor. Pedimos solo canciones (songCount)
            const url = buildUrl('search3', { query, songCount: limit, albumCount: 0, artistCount: 0 });
            const data = await fetchFromNavidrome(url);
            
            const songs = data['subsonic-response']?.searchResult3?.song || [];
            
            return songs.map((song: any) => ({
                id: song.id,
                title: song.title,
                artist: song.artist,
                album: song.album,
                duration: song.duration,
                coverArtUrl: buildUrl('getCoverArt', { id: song.coverArt || song.albumId || song.id, size: 300 }),
                streamUrl: buildUrl('stream', { id: song.id })
            }));
        } catch (error) {
            console.error("Error buscando canciones:", error);
            return [];
        }
    },

    searchUnified: async (query: string) => {
        if (!query.trim()) return { artists: [], albums: [], tracks: [] };
        
        try {
            // Pedimos 3 artistas, 5 álbumes y 5 canciones para no saturar la vista
            const url = buildUrl('search3', { query, artistCount: 3, albumCount: 5, songCount: 5 });
            const data = await fetchFromNavidrome(url);
            
            const result = data['subsonic-response']?.searchResult3 || {};
            
            return {
                artists: result.artist || [],
                albums: result.album || [],
                tracks: result.song || []
            };
        } catch (error) {
            console.error("Error buscando en el servidor NAS:", error);
            return { artists: [], albums: [], tracks: [] };
        }
    },

    // Obtener todos los generos disponibles en el servidor
    getGenres: async () => {
        const url = buildUrl('getGenres');
        const data = await fetchFromNavidrome(url);
        return data['subsonic-response']?.genres?.genre || [];
    },

    // Obtener canciones aleatorias de un genero especifico (Para el Mix)
    getGenreMix: async (genre: string, count: number = 50) => {
        // Limpiamos el texto por si trae espacios al inicio o al final
        const cleanGenre = genre.trim();
        
        // PLAN A: Intentamos con la busqueda aleatoria nativa
        let url = buildUrl('getRandomSongs', { genre: cleanGenre, size: count });
        let data = await fetchFromNavidrome(url);
        let songs = data['subsonic-response']?.randomSongs?.song || [];

        // PLAN B: Si Navidrome no devuelve nada (comun con generos como "Electronica")
        // Forzamos la busqueda estricta por genero
        if (songs.length === 0) {
            console.log(`getRandomSongs fallo para "${cleanGenre}". Usando Plan B...`);
            // Pedimos un lote mas grande para tener de donde escoger
            url = buildUrl('getSongsByGenre', { genre: cleanGenre, count: 150 });
            data = await fetchFromNavidrome(url);
            let fallbackSongs = data['subsonic-response']?.songsByGenre?.song || [];
            
            // Mezclamos (shuffle) el arreglo manualmente para simular el modo radio
            songs = fallbackSongs.sort(() => Math.random() - 0.5).slice(0, count);
        }

        return navidromeApi.mapSongsToTrack(songs, 'getGenreMix');
    },

    // Obtener albumes filtrados por genero (Para Nuevos Lanzamientos y Destacados)
    getGenreAlbums: async (genre: string, type: 'newest' | 'frequent' | 'random', count: number = 15): Promise<Album[]> => {
        const url = buildUrl('getAlbumList2', { type, genre, size: count });
        const data = await fetchFromNavidrome(url);
        const albums = data['subsonic-response']?.albumList2?.album || [];
        
        return albums.map((album: any) => ({
            id: album.id,
            title: album.name || album.title || 'Album Desconocido',
            artist: album.artist || 'Artista Desconocido',
            year: album.year,
            coverArtUrl: buildUrl('getCoverArt', { id: album.id, size: 300 })
        }));
    },
    
};