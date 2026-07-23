import AsyncStorage from '@react-native-async-storage/async-storage';
import { Track } from './navidromeApi';
import { downloadManager } from './downloadManager';
import { lyricsService } from './lyricsService';


const LIBRARY_KEY = '@aura_library';

export interface OfflineTrack extends Track {
    localUri: string;
    isManuallyDownloaded: boolean;
    isFavorited: boolean;
    savedAt: number; // Fecha en la que se guardó (para ordenar de más nuevo a más viejo)
}

class LocalLibraryService {
    
    // 1. OBTENER TODO EL DICCIONARIO
    private async getLibrary(): Promise<Record<string, OfflineTrack>> {
        try {
            const jsonValue = await AsyncStorage.getItem(LIBRARY_KEY);
            return jsonValue ? JSON.parse(jsonValue) : {};
        } catch (e) {
            console.error("Error leyendo la biblioteca local", e);
            return {};
        }
    }

    // 2. GUARDAR EL DICCIONARIO
    private async saveLibrary(library: Record<string, OfflineTrack>): Promise<void> {
        try {
            await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
        } catch (e) {
            console.error("Error guardando la biblioteca local", e);
        }
    }

    // 3. REGISTRAR UNA DESCARGA (Opción A: Descarga Manual)
    public async registerDownload(track: Track, localUri: string): Promise<void> {
        const library = await this.getLibrary();
        
        const existingTrack = library[track.id] || { 
            ...track, 
            localUri, 
            isFavorited: false,
            savedAt: Date.now()
        };

        // Activamos el interruptor de descarga manual
        existingTrack.isManuallyDownloaded = true;
        
        // Actualizamos la ruta por si acaso
        existingTrack.localUri = localUri;

        library[track.id] = existingTrack;
        await this.saveLibrary(library);
    }

    // 4. REGISTRAR UN FAVORITO (Opción B: Like)
    public async toggleFavorite(track: Track, localUri?: string): Promise<boolean> {
        const library = await this.getLibrary();
        
        let existingTrack = library[track.id];

        if (existingTrack) {
            // Ya existía (quizás estaba descargada), solo invertimos el corazón
            existingTrack.isFavorited = !existingTrack.isFavorited;
        } else {
            // No existía, la creamos con el corazón encendido
            existingTrack = {
                ...track,
                localUri: localUri || "", // Si no se ha descargado físicamente, queda vacío por ahora
                isManuallyDownloaded: false,
                isFavorited: true,
                savedAt: Date.now()
            };
        }

        // 🧹 LIMPIEZA: Si no está ni descargada ni en favoritos, la borramos del registro para no acumular basura
        if (!existingTrack.isFavorited && !existingTrack.isManuallyDownloaded) {
            delete library[track.id];
            const isNowFavorited = false;
            await this.saveLibrary(library);
            return isNowFavorited;
        }

        library[track.id] = existingTrack;
        await this.saveLibrary(library);
        return existingTrack.isFavorited;
    }

    // ==========================================
    // MÉTODOS PARA TUS PANTALLAS (FILTROS)
    // ==========================================

    // Devuelve un arreglo solo con las descargas manuales
    public async getDownloadedTracks(): Promise<OfflineTrack[]> {
        const library = await this.getLibrary();
        return Object.values(library)
            .filter(track => track.isManuallyDownloaded)
            .sort((a, b) => b.savedAt - a.savedAt); // Más recientes primero
    }

    // Devuelve un arreglo solo con tus "Likes"
    public async getFavoritedTracks(): Promise<OfflineTrack[]> {
        const library = await this.getLibrary();
        return Object.values(library)
            .filter(track => track.isFavorited)
            .sort((a, b) => b.savedAt - a.savedAt);
    }

    public async handleTrackLike(track: Track): Promise<boolean> {
        const isNowFavorited = await this.toggleFavorite(track);
        if (isNowFavorited) {
            try {
                // Pasamos el track.id al final
                const localUri = await downloadManager.downloadTrack(
                    track.streamUrl, track.title, track.artist, (track as any).suffix, track.id
                );
                await this.registerDownload(track, localUri); 
            } catch (error) {
                console.error(`[LIKE] Error al descargar`, error);
            }
        } 
        return isNowFavorited;
    }
    
    public async isTrackFavorited(trackId: string): Promise<boolean> {
        const library = await this.getLibrary();
        return !!library[trackId]?.isFavorited;
    }

    // 5. REMOVER UNA DESCARGA MANUAL
  public async removeDownloadedTrack(trackId: string): Promise<void> {
      const library = await this.getLibrary();
      const existingTrack = library[trackId];

      if (existingTrack) {
          // Apagamos el interruptor de descarga
          existingTrack.isManuallyDownloaded = false;

          // 🧹 LIMPIEZA: Si no está descargada ni tiene Like, la borramos del registro
          if (!existingTrack.isFavorited) {
              delete library[trackId];
          } else {
              // Si sigue siendo favorita (Liked), la conservamos pero vaciamos la ruta local 
              // porque el archivo MP3 ya no existirá en el disco.
              existingTrack.localUri = "";
              library[trackId] = existingTrack;
          }

          await this.saveLibrary(library);
      }
  }

  // 6. PURGAR REGISTROS MP3 (Limpieza Profunda)
    public async cleanLegacyMp3Registry(): Promise<void> {
        const library = await this.getLibrary();
        let hasChanges = false;

        for (const trackId in library) {
            const track = library[trackId];
            // Si el registro apunta a un MP3, lo limpiamos
            if (track.localUri && track.localUri.toLowerCase().endsWith('.mp3')) {
                track.isManuallyDownloaded = false;
                
                if (!track.isFavorited) {
                    delete library[trackId]; // Lo borramos por completo si no tiene Like
                } else {
                    track.localUri = ""; // Mantenemos el Like, pero vaciamos la ruta
                }
                hasChanges = true;
            }
        }

        if (hasChanges) {
            await this.saveLibrary(library);
            console.log("🧹 Registro local purgado de referencias MP3.");
        }
    }
    
}

export const localLibraryService = new LocalLibraryService();