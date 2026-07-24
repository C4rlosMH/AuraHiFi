import { encode as btoa } from 'base-64';

const SPOTIFY_CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET;

let accessToken = '';
let tokenExpiration = 0;

export const spotifyService = {
    
    getAccessToken: async (): Promise<string> => {
        if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
            throw new Error("Faltan las credenciales de Spotify en el archivo .env");
        }

        if (accessToken && Date.now() < tokenExpiration) {
            return accessToken;
        }

        const credentials = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
        
        try {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'grant_type=client_credentials'
            });

            const data = await response.json();
            if (data.access_token) {
                accessToken = data.access_token;
                tokenExpiration = Date.now() + (data.expires_in - 60) * 1000; 
                return accessToken;
            }
            throw new Error("No se pudo obtener el token de Spotify");
        } catch (error) {
            console.error("Error autenticando con Spotify:", error);
            throw error;
        }
    },

    search: async (query: string, type: 'album' | 'artist' | 'track' = 'album') => {
        try {
            const token = await spotifyService.getAccessToken();
            const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=5`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            
            if (type === 'album') return data.albums?.items || [];
            if (type === 'artist') return data.artists?.items || [];
            if (type === 'track') return data.tracks?.items || [];
            
            return [];
        } catch (error) {
            console.error("Error en la busqueda de Spotify:", error);
            return [];
        }
    }
};