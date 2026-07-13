import TrackPlayer, { RepeatMode } from 'react-native-track-player';
import { navidromeApi, Track } from './navidromeApi';
import { downloadManager } from './downloadManager'; // 🚀 Importamos tu gestor de archivos

class PlayerService {
    private originalQueue: Track[] = [];
    private isShuffleOn: boolean = false;
    private currentRepeatMode: RepeatMode = RepeatMode.Off;
    private queueListeners: (() => void)[] = [];
    
    private notifyQueueChange() {
        this.queueListeners.forEach(listener => listener());
    }
    
    public onQueueChange(listener: () => void) {
        this.queueListeners.push(listener);
        return () => {
            this.queueListeners = this.queueListeners.filter(l => l !== listener);
        };
    }

    // 🚀 INTERCEPTOR SMART PLAY (Ahora es Asíncrono)
    private async formatToNativeTrack(item: any, isUserAdded = false) {
        // 1. Calculamos cómo se llamaría este archivo si estuviera descargado
        const filename = downloadManager.getSafeFilename(item.title, item.artist || "Aura Hi-Fi");
        
        // 2. Le preguntamos a la bóveda si ya lo tiene
        const localUri = await downloadManager.getLocalUriIfExists(filename);

        if (localUri) {
            console.log(`[SMART PLAY] Reproduciendo LOCAL (Sin internet): ${item.title}`);
        } else {
            console.log(`[SMART PLAY] Streaming desde NAS: ${item.title}`);
        }

        return {
            id: item.id,
            // 3. PRIORIDAD ABSOLUTA: Si hay localUri, usamos ese; si no, gastamos datos
            url: localUri || item.streamUrl || item.url, 
            title: item.title,
            artist: item.artist,
            artwork: item.coverArtUrl || item.artwork,
            isUserAdded: isUserAdded || item.isUserAdded || false 
        };
    }

    public async playCollection(selectedTrack: Track, allTracks: Track[]) {
        try {
            this.originalQueue = allTracks;
            let tracksToSend = [...allTracks];
            let trackIndex = tracksToSend.findIndex(t => t.id === selectedTrack.id);

            if (this.isShuffleOn) {
                tracksToSend = tracksToSend.filter(t => t.id !== selectedTrack.id);
                for (let i = tracksToSend.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [tracksToSend[i], tracksToSend[j]] = [tracksToSend[j], tracksToSend[i]];
                }
                tracksToSend.unshift(selectedTrack);
                trackIndex = 0;
            }

            // 🚀 Usamos Promise.all porque el formateo ahora lee la memoria local
            const queuePromises = tracksToSend.map(item => this.formatToNativeTrack(item, false));
            const queue = await Promise.all(queuePromises);

            await TrackPlayer.reset();
            await TrackPlayer.add(queue);
            await TrackPlayer.skip(trackIndex);
            await TrackPlayer.play();

            this.notifyQueueChange();
        } catch (error) {
            console.error("Error en PlayerService.playCollection:", error);
        }
    }

    public async togglePlayback() {
        const playbackState = await TrackPlayer.getPlaybackState();
        if (playbackState.state === 'playing') {
            await TrackPlayer.pause();
        } else {
            await TrackPlayer.play();
        }
    }

    public async next() { try { await TrackPlayer.skipToNext(); } catch (e) {} }
    public async previous() { try { await TrackPlayer.skipToPrevious(); } catch (e) {} }

    public async toggleRepeat(): Promise<RepeatMode> {
        if (this.currentRepeatMode === RepeatMode.Off) {
            this.currentRepeatMode = RepeatMode.Queue; 
        } else if (this.currentRepeatMode === RepeatMode.Queue) {
            this.currentRepeatMode = RepeatMode.Track; 
        } else {
            this.currentRepeatMode = RepeatMode.Off; 
        }

        try {
            await TrackPlayer.setRepeatMode(this.currentRepeatMode);
        } catch (error) {
            console.error("[REPEAT] Error al cambiar el modo en el motor:", error);
        }

        return this.currentRepeatMode;
    }

    public async toggleShuffle(): Promise<boolean> {
        this.isShuffleOn = !this.isShuffleOn;
        console.log(`\n[SHUFFLE] Modificado. Estado: ${this.isShuffleOn ? 'ENCENDIDO' : 'APAGADO'}`);

        try {
            let currentTrackIndex;
            try { currentTrackIndex = await TrackPlayer.getActiveTrackIndex(); } 
            catch { currentTrackIndex = await TrackPlayer.getCurrentTrack(); }

            if (currentTrackIndex !== null && currentTrackIndex !== undefined) {
                const nativeQueue = await TrackPlayer.getQueue();
                const currentTrackNative = nativeQueue[currentTrackIndex];
                
                // 🚀 Promise.all para las canciones prioritarias
                const priorityUpcomingPromises = nativeQueue
                    .slice(currentTrackIndex + 1)
                    .filter(t => t.isUserAdded)
                    .map(t => this.formatToNativeTrack(t, true));
                
                const priorityUpcoming = await Promise.all(priorityUpcomingPromises);

                const currentIndexInOriginal = this.originalQueue.findIndex(t => t.id === currentTrackNative?.id);
                let upcomingCollection: any[] = [];

                if (this.isShuffleOn) {
                    let pool = this.originalQueue
                        .filter(t => t.id !== currentTrackNative?.id) 
                        .map((track) => {
                            const originalIndex = this.originalQueue.findIndex(t => t.id === track.id);
                            const isPlayed = originalIndex < currentIndexInOriginal;
                            return { track, weight: isPlayed ? 1 : 5 };
                        });

                    let shuffledCollection = [];
                    while (pool.length > 0) {
                        let totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
                        let randomVal = Math.random() * totalWeight;

                        for (let i = 0; i < pool.length; i++) {
                            randomVal -= pool[i].weight;
                            if (randomVal <= 0) {
                                shuffledCollection.push(pool[i].track);
                                pool.splice(i, 1); 
                                break;
                            }
                        }
                    }
                    
                    // 🚀 Promise.all para la colección en modo aleatorio
                    const upcomingPromises = shuffledCollection.map(item => this.formatToNativeTrack(item, false));
                    upcomingCollection = await Promise.all(upcomingPromises);
                } else {
                    // 🚀 Promise.all para la colección en modo normal
                    const upcomingOriginal = this.originalQueue.slice(currentIndexInOriginal + 1);
                    const upcomingPromises = upcomingOriginal.map(item => this.formatToNativeTrack(item, false));
                    upcomingCollection = await Promise.all(upcomingPromises);
                }

                const indexesToRemove = [];
                for (let i = currentTrackIndex + 1; i < nativeQueue.length; i++) {
                    indexesToRemove.push(i);
                }
                if (indexesToRemove.length > 0) {
                    await TrackPlayer.remove(indexesToRemove);
                }

                const finalUpcomingQueue = [...priorityUpcoming, ...upcomingCollection];
                if (finalUpcomingQueue.length > 0) {
                    await TrackPlayer.add(finalUpcomingQueue);
                }
                
                this.notifyQueueChange();
            }
        } catch (error) {
            console.error("[SHUFFLE] Error al mutar la cola:", error);
        }

        return this.isShuffleOn;
    }

    public async toggleFavoriteServer(trackId: string): Promise<void> {
        try {
            await navidromeApi.toggleFavorite(trackId);
        } catch (error) {
            console.error("Error en PlayerService.toggleFavoriteServer:", error);
            throw error;
        }
    }

    public async playNext(track: any) {
        try {
            let currentIndex;
            try { currentIndex = await TrackPlayer.getActiveTrackIndex(); } 
            catch { currentIndex = await TrackPlayer.getCurrentTrack(); }
            
            const insertIndex = (currentIndex !== undefined && currentIndex !== null) ? currentIndex + 1 : 0;
            
            // 🚀 AWAIT para que formatee leyendo de memoria
            const formattedTrack = await this.formatToNativeTrack(track, true);
            await TrackPlayer.add([formattedTrack], insertIndex);
            
            this.notifyQueueChange();
        } catch (error) {
            console.error("Error en playNext:", error);
        }
    }

    public async appendToQueue(track: any) {
        try {
            let currentIndex;
            try { currentIndex = await TrackPlayer.getActiveTrackIndex(); } 
            catch { currentIndex = await TrackPlayer.getCurrentTrack(); }
            
            const nativeQueue = await TrackPlayer.getQueue();
            let insertIndex = nativeQueue.length;
            
            if (currentIndex !== undefined && currentIndex !== null) {
                let lastUserTrackIndex = currentIndex;
                
                for (let i = currentIndex + 1; i < nativeQueue.length; i++) {
                    if (nativeQueue[i].isUserAdded) {
                        lastUserTrackIndex = i;
                    } else {
                        break;
                    }
                }
                insertIndex = lastUserTrackIndex + 1;
            }

            // 🚀 AWAIT para que formatee leyendo de memoria
            const formattedTrack = await this.formatToNativeTrack(track, true);
            await TrackPlayer.add([formattedTrack], insertIndex);
            
            this.notifyQueueChange();
        } catch (error) {
            console.error("Error en appendToQueue:", error);
        }
    }

    public async removeFromQueue(index: number) {
        try {
            let currentIndex;
            try { currentIndex = await TrackPlayer.getActiveTrackIndex(); } 
            catch { currentIndex = await TrackPlayer.getCurrentTrack(); }

            if (index === currentIndex) return false; 
            
            await TrackPlayer.remove(index);
            this.notifyQueueChange();
            return true;
        } catch (error) {
            console.error("Error en removeFromQueue:", error);
            return false;
        }
    }
    
    public async addTracksToQueue(tracks: any[]) {
      try {
          // 1. Pasamos cada canción por tu interceptor Smart Play para ver si es local o NAS
          const formattedTracksPromises = tracks.map(track => this.formatToNativeTrack(track, true));
          
          // 2. Esperamos a que todas las canciones se formateen correctamente
          const formattedTracks = await Promise.all(formattedTracksPromises);

          // 3. Mandamos todo el batallón de canciones al final de la fila nativa
          await TrackPlayer.add(formattedTracks);
          
          // 4. Notificamos a tus pantallas que la cola ha crecido
          this.notifyQueueChange();
      } catch (error) {
          console.error("Error al añadir lote a la fila:", error);
      }
  }
    
}

export const playerService = new PlayerService();