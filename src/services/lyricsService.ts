import { buildUrl, fetchFromNavidrome } from './navidromeApi';
import { parseLrc, ParsedLyric } from '../utils/lrcParser';
import { downloadManager } from './downloadManager'; // 🚀 Importamos el motor de almacenamiento

export const lyricsService = {
    
    // 🚀 0. LA NUEVA PRIORIDAD ABSOLUTA: Leer letras del disco duro (Latencia cero)
    getLyricsFromLocalDisk: async (title: string, artist: string): Promise<{ synced: ParsedLyric[], staticText: string | null }> => {
        try {
            const localText = await downloadManager.readLyricsOffline(title, artist);
            
            if (localText) {
                const parsed = parseLrc(localText);
                if (parsed.length > 0) {
                    return { synced: parsed, staticText: null };
                }
                // Si encontramos el archivo pero no pudimos extraer los tiempos
                return { synced: [], staticText: localText };
            }
            return { synced: [], staticText: null };
        } catch (error) {
            console.log("No se pudieron leer las letras locales", error);
            return { synced: [], staticText: null };
        }
    },

    // 🚀 1. EL ENDPOINT OPENSUBSONIC (Busca tu archivo .lrc en tu Servidor)
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
                    time: line.start / 1000, 
                    text: line.value
                }));
                if (synced.length > 0) return { synced, staticText: null };
            }

            // CASO B: Navidrome encontró letras pero sin tiempos (texto plano)
            if (lyricsList && lyricsList.text) {
                const parsed = parseLrc(lyricsList.text);
                if (parsed.length > 0) {
                    return { synced: parsed, staticText: null };
                }
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
                return parseLrc(data.syncedLyrics); 
            }
            return [];
        } catch (error) {
            console.error("Error contactando a LRCLIB:", error);
            return [];
        }
    },
    
    // 👴 3. EL ENDPOINT VIEJO (El último recurso del Servidor)
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