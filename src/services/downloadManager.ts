import * as FileSystem from 'expo-file-system/legacy';
import { Track } from './navidromeApi';

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

    getSafeFilename(title: string, artist: string): string {
        const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
        const cleanArtist = artist.replace(/[^a-zA-Z0-9]/g, '_');
        return `${cleanArtist}_${cleanTitle}.mp3`;
    },

    async getLocalUriIfExists(filename: string): Promise<string | null> {
        const fileUri = `${AURA_AUDIO_DIR}${filename}`;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        return fileInfo.exists ? fileUri : null;
    },

    async downloadTrack(url: string, title: string, artist: string): Promise<string> {
        await this.initializeDirectory();
        
        const filename = this.getSafeFilename(title, artist);
        const localUri = await this.getLocalUriIfExists(filename);

        if (localUri) {
            console.log("Archivo encontrado localmente en el sandbox.");
            return localUri;
        }

        console.log("Iniciando descarga al sandbox...");
        const destinationUri = `${AURA_AUDIO_DIR}${filename}`;
        
        try {
            const downloadResult = await FileSystem.downloadAsync(url, destinationUri);
            return downloadResult.uri;
        } catch (error) {
            console.error("Error en la descarga:", error);
            throw error;
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
    }
};