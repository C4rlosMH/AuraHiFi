const SERVER_IP = process.env.EXPO_PUBLIC_SERVER_IP; 
const BASE_URL = `${SERVER_IP}/rest`;

const USER = process.env.EXPO_PUBLIC_NAVIDROME_USER;
const PASS = process.env.EXPO_PUBLIC_NAVIDROME_PASS;
const CLIENT = 'AuraHiFi';
const VERSION = '1.16.1';

// Tu función original (la dejamos por si alguna función antigua la sigue usando)
const getAuthQuery = () => `u=${USER}&p=${PASS}&v=${VERSION}&c=${CLIENT}&f=json`;

// 1. NUESTRA NUEVA FUNCIÓN BUILD URL BLINDADA
export const buildUrl = (endpoint: string, extraParams: Record<string, any> = {}) => {
    // Usamos encodeURIComponent en USER y PASS para evitar que símbolos rompan la URL
    let url = `${BASE_URL}/${endpoint}?u=${encodeURIComponent(USER || '')}&p=${encodeURIComponent(PASS || '')}&v=${VERSION}&c=${encodeURIComponent(CLIENT)}&f=json`;
    
    // Inyectamos dinámicamente cualquier parámetro extra (como limits, offsets, etc.)
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
            coverArtUrl: buildUrl('getCoverArt', { id: album.id, size: 500 }),
            year: album.year,
            songCount: album.songCount,
            totalDuration: album.duration,
            tracks: (album.song || []).map((song: any) => ({
                id: song.id,
                title: song.title,
                artist: song.artist,
                album: song.album,
                duration: song.duration,
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
            tracks: (playlist.entry || []).map((song: any) => ({
                id: song.id,
                title: song.title,
                artist: song.artist,
                album: song.album,
                duration: song.duration,
                artwork: buildUrl('getCoverArt', { id: song.coverArt || song.albumId || song.id, size: 300 }),
                url: buildUrl('stream', { id: song.id })
            }))
        };
    },

    toggleStar: async (id: string, isStarred: boolean) => {
        const endpoint = isStarred ? 'unstar' : 'star';
        const url = buildUrl(endpoint, { id });
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
};