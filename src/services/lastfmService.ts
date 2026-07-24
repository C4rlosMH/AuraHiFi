const LASTFM_API_KEY = process.env.EXPO_PUBLIC_LASTFM_API_KEY;
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

export const lastfmService = {
    
    getAlbumMBID: async (artistName: string, albumName: string): Promise<string | null> => {
        if (!LASTFM_API_KEY) {
            console.warn("Falta la API Key de Last.fm en el archivo .env");
            return null;
        }

        try {
            const url = `${BASE_URL}?method=album.getinfo&api_key=${LASTFM_API_KEY}&artist=${encodeURIComponent(artistName)}&album=${encodeURIComponent(albumName)}&format=json`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.album && data.album.mbid) {
                return data.album.mbid;
            }
            return null;
        } catch (error) {
            console.error("Error contactando a Last.fm para el album:", error);
            return null;
        }
    },

    getArtistMBID: async (artistName: string): Promise<string | null> => {
        try {
            const apiKey = process.env.EXPO_PUBLIC_LASTFM_API_KEY;
            // Usamos el endpoint artist.getinfo
            const url = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${apiKey}&format=json`;
            const response = await fetch(url);
            const data = await response.json();
            
            return data.artist?.mbid || null;
        } catch (error) {
            console.error("Error obteniendo MBID del artista:", error);
            return null;
        }
    }
};