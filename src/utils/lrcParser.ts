// src/utils/lrcParser.ts

export interface ParsedLyric {
  id: string;
  time: number; // Tiempo exacto en segundos
  text: string;
}

export function parseLrc(lrcString: string): ParsedLyric[] {
  if (!lrcString) return [];

  const lines = lrcString.split('\n');
  const parsedLyrics: ParsedLyric[] = [];
  
  // Esta expresión regular busca el patrón [00:00.00] o [00:00.000]
  const timeRegex = /\[(\d{2,}):(\d{2}(?:\.\d{2,3})?)\](.*)/;

  lines.forEach((line, index) => {
    const match = timeRegex.exec(line);
    
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseFloat(match[2]);
      const text = match[3].trim(); // Limpiamos espacios vacíos

      // Solo agregamos la línea si realmente tiene texto o si quieres mostrar las pausas instrumentales
      if (text || text === '') {
        parsedLyrics.push({
          id: `lyric-${index}`,
          time: (minutes * 60) + seconds, // Convertimos todo a segundos puros
          text: text
        });
      }
    }
  });

  return parsedLyrics;
}