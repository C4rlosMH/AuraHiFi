const SERVER_IP = process.env.EXPO_PUBLIC_SERVER_IP; 
const BASE_URL = `${SERVER_IP}/rest`;

const USER = process.env.EXPO_PUBLIC_NAVIDROME_USER;
const PASS = process.env.EXPO_PUBLIC_NAVIDROME_PASS;
const CLIENT = 'AuraHiFi';
const VERSION = '1.16.1';

const getAuthQuery = () => `u=${USER}&p=${PASS}&v=${VERSION}&c=${CLIENT}&f=json`;

export interface Track {
    id: string;
    title: string;
    artist: string;
    album: string;
    duration: number;
    coverArtUrl: string;
    streamUrl: string;
}

export const navidromeApi = {
    // Funcion auxiliar para estandarizar el mapeo de canciones
    mapSongsToTracks(songs: any[], query: string): Track[] {
        return songs.map((song: any) => ({
            id: song.id,
            title: song.title,
            artist: song.artist,
            album: song.album,
            duration: song.duration,
            coverArtUrl: song.coverArt 
                ? `${BASE_URL}/getCoverArt.view?${query}&id=${song.coverArt}&size=300` 
                : 'https://via.placeholder.com/300/1E1E1E/FFFFFF?text=Sin+Portada',
            streamUrl: `${BASE_URL}/stream.view?${query}&id=${song.id}`
        }));
    },

    async getAllTracks(limit: number = 1000): Promise<Track[]> {
        try {
            const query = getAuthQuery();
            console.log("🔥 SOLICITANDO CATÁLOGO A NAVIDROME...");
            
            // Le agregamos &songCount=1000 para que nos devuelva todo tu catálogo de golpe
            const url = `${BASE_URL}/search3.view?${query}&query=*&songCount=${limit}`;
            
            const response = await fetch(url);
            const data = await response.json();
            const songs = data['subsonic-response']?.searchResult3?.song || [];
            
            console.log(`✅ NAVIDROME DEVOLVIÓ: ${songs.length} CANCIONES`);
            return this.mapSongsToTracks(songs, query);
        } catch (error) {
            console.error("Error conectando con Navidrome:", error);
            return [];
        }
    },

    async toggleFavorite(id: string): Promise<void> {
        try {
            const query = getAuthQuery();
            await fetch(`${BASE_URL}/star.view?${query}&id=${id}`);
        } catch (error) {
            console.error("Error al marcar como favorito:", error);
        }
    },

    async getStarredTracks(): Promise<Track[]> {
        try {
            const query = getAuthQuery();
            // Corregido: La API de Subsonic utiliza getStarred2.view
            const response = await fetch(`${BASE_URL}/getStarred2.view?${query}`);
            
            // Agregamos una validacion para no intentar parsear texto plano si el servidor falla
            if (!response.ok) {
                console.error("Error en respuesta del servidor. Status:", response.status);
                return [];
            }

            const data = await response.json();
            // Corregido: El nodo de respuesta corresponde a starred2
            const songs = data['subsonic-response']?.starred2?.song || [];
            
            return this.mapSongsToTracks(songs, query);
        } catch (error) {
            console.error("Error al obtener favoritos:", error);
            return [];
        }
    },

    async getAlbumTracks(albumId: string): Promise<Track[]> {
        try {
            const query = getAuthQuery();
            const response = await fetch(`${BASE_URL}/getAlbum.view?${query}&id=${albumId}`);
            const data = await response.json();
            const songs = data['subsonic-response']?.album?.song || [];
            return this.mapSongsToTracks(songs, query);
        } catch (error) {
            console.error("Error al obtener canciones del album:", error);
            return [];
        }
    },

    async getPlaylistTracks(playlistId: string): Promise<Track[]> {
        try {
            const query = getAuthQuery();
            const response = await fetch(`${BASE_URL}/getPlaylist.view?${query}&id=${playlistId}`);
            const data = await response.json();
            const songs = data['subsonic-response']?.playlist?.entry || [];
            return this.mapSongsToTracks(songs, query);
        } catch (error) {
            console.error("Error al obtener canciones de la playlist:", error);
            return [];
        }
    },

    // 🔥 NUEVA FUNCIÓN: Bypass de Navidrome para buscar letras exactas
    async getSyncedLyricsFromLRCLIB(artist: string, title: string): Promise<string | null> {
        try {
            console.log(`Buscando letra sincronizada en LRCLIB para: ${title} - ${artist}`);
            
            const encodedArtist = encodeURIComponent(artist);
            const encodedTitle = encodeURIComponent(title);
            
            // Endpoint público de LRCLIB
            const url = `https://lrclib.net/api/get?artist_name=${encodedArtist}&track_name=${encodedTitle}`;
            
            const response = await fetch(url);
            if (!response.ok) return null;
            
            const data = await response.json();
            
            // LRCLIB devuelve un campo 'syncedLyrics' que trae los tiempos exactos [00:15.30]
            if (data && data.syncedLyrics) {
                return data.syncedLyrics;
            }
            
            return null;
        } catch (error) {
            console.error("Error contactando a LRCLIB:", error);
            return null;
        }
    }
};

