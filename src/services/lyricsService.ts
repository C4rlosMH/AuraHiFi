import { buildUrl, fetchFromNavidrome } from './navidromeApi';
import { parseLrc, ParsedLyric } from '../utils/lrcParser'; // Asumo que esta es la ruta a tu parser

export const lyricsService = {
    
    // 🚀 1. EL NUEVO ENDPOINT OPENSUBSONIC (Busca tu archivo .lrc local por ID)
    getLyricsFromNAS: async (songId: string): Promise<{ synced: ParsedLyric[], staticText: string | null }> => {
        try {
            const url = buildUrl('getLyricsBySongId', { id: songId });
            const data = await fetchFromNavidrome(url);
            
            const lyricsList = data['subsonic-response']?.lyricsList;
            
            // CASO A: Navidrome encontró tu .lrc y lo procesó nativamente
            if (lyricsList && lyricsList.structuredLyrics && lyricsList.structuredLyrics.length > 0) {
                const lines = lyricsList.structuredLyrics[0].line || [];
                
                const synced: ParsedLyric[] = lines.map((line: any, index: number) => ({
                    id: `nas-lrc-${index}`,
                    time: line.start / 1000, // Navidrome envía milisegundos, tu app usa segundos
                    text: line.value
                }));
                
                if (synced.length > 0) return { synced, staticText: null };
            }

            // CASO B: Navidrome encontró letras pero sin tiempos (texto plano)
            if (lyricsList && lyricsList.text) {
                // A veces manda el texto del archivo .lrc en crudo. Intentamos parsearlo por si acaso:
                const parsed = parseLrc(lyricsList.text);
                if (parsed.length > 0) {
                    return { synced: parsed, staticText: null };
                }
                // Si no se pudo parsear, es texto estático 100%
                return { synced: [], staticText: lyricsList.text };
            }

            return { synced: [], staticText: null };
        } catch (error) {
            console.log("NAS no tiene letras para este ID o no soporta OpenSubsonic:", error);
            return { synced: [], staticText: null };
        }
    },

    // 🌐 2. EL RESPALDO DE INTERNET (LRCLIB)
    getLyricsFromLRCLIB: async (artist: string, title: string): Promise<ParsedLyric[]> => {
        try {
            const encodedArtist = encodeURIComponent(artist);
            const encodedTitle = encodeURIComponent(title);
            const url = `https://lrclib.net/api/get?artist_name=${encodedArtist}&track_name=${encodedTitle}`;
            
            const response = await fetch(url);
            if (!response.ok) return [];
            
            const data = await response.json();
            if (data && data.syncedLyrics) {
                // Reutilizamos tu parseLrc para mantener todo uniforme
                return parseLrc(data.syncedLyrics); 
            }
            return [];
        } catch (error) {
            console.error("Error contactando a LRCLIB:", error);
            return [];
        }
    },
    
    // 👴 3. EL ENDPOINT VIEJO (El último recurso)
    getOldStaticLyrics: async (artist: string, title: string): Promise<string | null> => {
        try {
            const url = buildUrl('getLyrics', { artist, title });
            const data = await fetchFromNavidrome(url);
            return data['subsonic-response']?.lyrics?.value || null;
        } catch (error) {
            return null;
        }
    }
};