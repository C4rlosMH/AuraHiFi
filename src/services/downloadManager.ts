import * as FileSystem from 'expo-file-system/legacy';
import { Track } from './navidromeApi';
import { lyricsService } from './lyricsService';

const AURA_AUDIO_DIR = `${(FileSystem as any).documentDirectory}aura_music/`;



export const downloadManager = {
    async initializeDirectory() {
        try {
            const rootInfo = await FileSystem.getInfoAsync((FileSystem as any).documentDirectory || "");
            if (!rootInfo.exists) {
                console.error("El sistema de archivos de documentos no esta accesible.");
                return;
            }

            const dirInfo = await FileSystem.getInfoAsync(AURA_AUDIO_DIR);
            if (!dirInfo.exists) {
                console.log("Creando directorio sandbox en:", AURA_AUDIO_DIR);
                await FileSystem.makeDirectoryAsync(AURA_AUDIO_DIR, { intermediates: true });
            }
        } catch (error) {
            console.error("Error critico al inicializar el directorio:", error);
        }
    },

    getSafeFilename(title: string, artist: string, suffix: string = 'flac'): string {
        const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
        const cleanArtist = artist.replace(/[^a-zA-Z0-9]/g, '_');
        return `${cleanArtist}_${cleanTitle}.${suffix}`;
    },

    async getLocalUriIfExists(filename: string): Promise<string | null> {
        const fileUri = `${AURA_AUDIO_DIR}${filename}`;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        return fileInfo.exists ? fileUri : null;
    },

    async downloadTrack(url: string, title: string, artist: string, suffix: string = 'flac', trackId?: string): Promise<string> {
        await this.initializeDirectory();
        
        const filename = this.getSafeFilename(title, artist, suffix);
        const localUri = await this.getLocalUriIfExists(filename);

        if (localUri) {
            console.log("Archivo encontrado localmente en el sandbox.");
            // Si ya existe el audio, intentamos bajar las letras de todos modos por si faltan
            if (trackId) await this.attemptToDownloadLyrics(trackId, title, artist);
            return localUri;
        }

        console.log("Iniciando descarga al sandbox en formato:", suffix);
        const destinationUri = `${AURA_AUDIO_DIR}${filename}`;
        
        try {
            const downloadResult = await FileSystem.downloadAsync(url, destinationUri);
            
            // NUEVO: Después de bajar el audio, buscamos la letra automáticamente
            if (trackId) {
                await this.attemptToDownloadLyrics(trackId, title, artist);
            }

            return downloadResult.uri;
        } catch (error) {
            console.error("Error en la descarga:", error);
            throw error;
        }
    },

    async attemptToDownloadLyrics(trackId: string, title: string, artist: string) {
        try {
            const nasLyrics = await lyricsService.getLyricsFromNAS(trackId);
            let lyricsTextToSave = nasLyrics.staticText;

            // Reconstruimos el archivo .lrc si hay tiempos
            if (nasLyrics.synced.length > 0) {
                lyricsTextToSave = nasLyrics.synced.map(line => {
                    const m = Math.floor(line.time / 60).toString().padStart(2, '0');
                    const s = (line.time % 60).toFixed(2).padStart(5, '0');
                    return `[${m}:${s}] ${line.text}`;
                }).join('\n');
            }

            // Respaldo
            if (!lyricsTextToSave) {
                lyricsTextToSave = await lyricsService.getOldStaticLyrics(artist, title);
            }

            // Guardamos
            if (lyricsTextToSave) {
                await this.saveLyricsOffline(title, artist, lyricsTextToSave);
            }
        } catch (error) {
            console.log(`No se encontraron letras para ${title}.`);
        }
    },

    // Descarga de colecciones por lotes
    async downloadCollection(
        tracks: Track[], 
        onProgress?: (downloaded: number, total: number) => void
    ): Promise<void> {
        await this.initializeDirectory();
        const total = tracks.length;
        let downloadedCount = 0;

        console.log(`Iniciando descarga en lote de ${total} pistas.`);

        for (const track of tracks) {
            try {
                await this.downloadTrack(track.streamUrl, track.title, track.artist);
                downloadedCount++;
                
                if (onProgress) {
                    onProgress(downloadedCount, total);
                }
            } catch (error) {
                console.error(`Fallo la descarga automatica de: ${track.title}`, error);
            }
        }
        console.log("Descarga del lote completada con exito.");
    },
    
    async listDownloadedFiles(): Promise<void> {
        try {
            await this.initializeDirectory(); // Aseguramos que el folder exista
            const files = await FileSystem.readDirectoryAsync(AURA_AUDIO_DIR);
            
            console.log(`\n=== 📂 AUDITORÍA DE AURA OFFLINE ===`);
            console.log(`Total de pistas descargadas: ${files.length}`);
            
            for (const file of files) {
                const fileInfo = await FileSystem.getInfoAsync(`${AURA_AUDIO_DIR}${file}`);
                // Convertimos los bytes a Megabytes para que sea legible
                const sizeMB = fileInfo.exists ? (fileInfo.size / (1024 * 1024)).toFixed(2) : 0;
                console.log(`🎵 ${file} - ${sizeMB} MB`);
            }
            console.log(`====================================\n`);
            
        } catch (error) {
            console.error("Error al auditar el directorio:", error);
        }
    },

    async deleteDownloadedFile(filename: string): Promise<boolean> {
      try {
          const fileUri = `${AURA_AUDIO_DIR}${filename}`;
          const fileInfo = await FileSystem.getInfoAsync(fileUri);
          
          if (fileInfo.exists) {
              await FileSystem.deleteAsync(fileUri);
              console.log(`Archivo físico eliminado: ${filename}`);
              return true;
          }
          return false;
      } catch (error) {
          console.error("Error al intentar eliminar el archivo físico:", error);
          return false;
      }
  },

  async getStorageStats() {
        await this.initializeDirectory();
        
        let flacBytes = 0;
        let mp3Bytes = 0;
        let lrcBytes = 0;
        let artworkBytes = 0;

        // Auditoria del directorio de descargas de Aura
        try {
            const files = await FileSystem.readDirectoryAsync(AURA_AUDIO_DIR);
            for (const file of files) {
                const fileInfo = await FileSystem.getInfoAsync(`${AURA_AUDIO_DIR}${file}`);
                
                if (fileInfo.exists && !fileInfo.isDirectory && fileInfo.size) {
                    const size = fileInfo.size;
                    const lowerFile = file.toLowerCase();
                    
                    if (lowerFile.endsWith('.flac') || lowerFile.endsWith('.alac') || lowerFile.endsWith('.wav')) {
                        flacBytes += size;
                    } else if (lowerFile.endsWith('.mp3') || lowerFile.endsWith('.m4a') || lowerFile.endsWith('.aac')) {
                        mp3Bytes += size;
                    } else if (lowerFile.endsWith('.lrc')) {
                        lrcBytes += size;
                    } else if (lowerFile.endsWith('.jpg') || lowerFile.endsWith('.png')) {
                        artworkBytes += size;
                    }
                }
            }
        } catch (error) {
            console.error("Error al calcular el almacenamiento local:", error);
        }

        // Auditoria REAL del directorio de cache del sistema
        let realCacheBytes = 0;
        try {
            const cacheDir = FileSystem.cacheDirectory;
            if (cacheDir) {
                const cacheFiles = await FileSystem.readDirectoryAsync(cacheDir);
                for (const file of cacheFiles) {
                    const fileInfo = await FileSystem.getInfoAsync(`${cacheDir}${file}`);
                    if (fileInfo.exists && !fileInfo.isDirectory && fileInfo.size) {
                        realCacheBytes += fileInfo.size;
                    }
                }
            }
        } catch (error) {
            console.error("Error al calcular la cache temporal:", error);
        }

        let freeDisk = 0;
        let totalDisk = 0;
        try {
            freeDisk = await FileSystem.getFreeDiskStorageAsync();
            totalDisk = await FileSystem.getTotalDiskCapacityAsync();
        } catch (error) {
            console.log("No se pudo obtener la capacidad total del disco.");
        }

        return { flacBytes, mp3Bytes, lrcBytes, artworkBytes, realCacheBytes, freeDisk, totalDisk };
    },

    async purgeLegacyMp3Files(): Promise<number> {
        try {
            await this.initializeDirectory();
            const files = await FileSystem.readDirectoryAsync(AURA_AUDIO_DIR);
            let deletedCount = 0;
            
            for (const file of files) {
                if (file.toLowerCase().endsWith('.mp3')) {
                    await FileSystem.deleteAsync(`${AURA_AUDIO_DIR}${file}`);
                    console.log(`🗑️ Archivo MP3 fantasma eliminado: ${file}`);
                    deletedCount++;
                }
            }
            return deletedCount;
        } catch (error) {
            console.error("Error durante la purga de MP3:", error);
            return 0;
        }
    },

    async saveLyricsOffline(title: string, artist: string, lyricsText: string): Promise<string | null> {
        if (!lyricsText) return null;
        await this.initializeDirectory();
        
        // Usamos la misma funcion de limpieza para que el nombre coincida con el audio
        const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
        const cleanArtist = artist.replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `${cleanArtist}_${cleanTitle}.lrc`;
        const destinationUri = `${AURA_AUDIO_DIR}${filename}`;
        
        try {
            await FileSystem.writeAsStringAsync(destinationUri, lyricsText, {
                encoding: FileSystem.EncodingType.UTF8,
            });
            console.log("Letras guardadas en disco:", filename);
            return destinationUri;
        } catch (error) {
            console.error("Error al escribir el archivo LRC local:", error);
            return null;
        }
    }
};