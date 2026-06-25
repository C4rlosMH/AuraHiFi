import TrackPlayer, { RepeatMode } from 'react-native-track-player';
import { navidromeApi, Track } from './navidromeApi';

class PlayerService {
    private originalQueue: Track[] = [];
    private isShuffleOn: boolean = false;
    private currentRepeatMode: RepeatMode = RepeatMode.Off;

    public async playCollection(selectedTrack: Track, allTracks: Track[]) {
        try {
            this.originalQueue = allTracks;
            let tracksToSend = [...allTracks];
            let trackIndex = tracksToSend.findIndex(t => t.id === selectedTrack.id);

            // Si el modo aleatorio ya estaba encendido al hacer clic en una cancion
            if (this.isShuffleOn) {
                tracksToSend = tracksToSend.filter(t => t.id !== selectedTrack.id);
                for (let i = tracksToSend.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [tracksToSend[i], tracksToSend[j]] = [tracksToSend[j], tracksToSend[i]];
                }
                tracksToSend.unshift(selectedTrack);
                trackIndex = 0;
            }

            const queue = tracksToSend.map(item => ({
                id: item.id,
                url: item.streamUrl,
                title: item.title,
                artist: item.artist,
                artwork: item.coverArtUrl
            }));

            await TrackPlayer.reset();
            await TrackPlayer.add(queue);
            await TrackPlayer.skip(trackIndex);
            await TrackPlayer.play();
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
            this.currentRepeatMode = RepeatMode.Track;
        } else if (this.currentRepeatMode === RepeatMode.Track) {
            this.currentRepeatMode = RepeatMode.Queue;
        } else {
            this.currentRepeatMode = RepeatMode.Off;
        }
        await TrackPlayer.setRepeatMode(this.currentRepeatMode);
        return this.currentRepeatMode;
    }

    public async toggleShuffle(): Promise<boolean> {
        this.isShuffleOn = !this.isShuffleOn;
        
        console.log(`\n[SHUFFLE] Boton presionado. Estado: ${this.isShuffleOn ? 'ENCENDIDO' : 'APAGADO'}`);

        try {
            const currentTrackIndex = await TrackPlayer.getCurrentTrack();
            if (currentTrackIndex !== null && this.originalQueue.length > 0) {
                const nativeQueue = await TrackPlayer.getQueue();
                const currentTrackNative = nativeQueue[currentTrackIndex];
                
                // Ubicamos donde estamos en la lista original para saber que es "pasado" y que es "futuro"
                const currentIndexInOriginal = this.originalQueue.findIndex(t => t.id === currentTrackNative.id);
                
                if (this.isShuffleOn) {
                    console.log(`[SHUFFLE] Aplicando Seleccion Ponderada Inteligente...`);
                    
                    // 1. Crear la piscina de seleccion con pesos asignados
                    let pool = this.originalQueue
                        .filter(t => t.id !== currentTrackNative.id) // Excluimos la que esta sonando
                        .map((track, index) => {
                            // Si su indice original es menor al actual, ya paso.
                            const originalIndex = this.originalQueue.findIndex(t => t.id === track.id);
                            const isPlayed = originalIndex < currentIndexInOriginal;
                            
                            return {
                                track,
                                weight: isPlayed ? 1 : 5 // Las no escuchadas tienen 5 veces mas probabilidad
                            };
                        });

                    let newUpcoming = [];

                    // 2. Extraer canciones basandonos en su peso hasta vaciar la piscina
                    while (pool.length > 0) {
                        let totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
                        let randomVal = Math.random() * totalWeight;

                        for (let i = 0; i < pool.length; i++) {
                            randomVal -= pool[i].weight;
                            if (randomVal <= 0) {
                                newUpcoming.push(pool[i].track);
                                pool.splice(i, 1); // Retiramos la cancion elegida para no repetirla
                                break;
                            }
                        }
                    }

                    // 3. Convertir al formato nativo
                    const nativeUpcoming = newUpcoming.map(item => ({
                        id: item.id,
                        url: item.streamUrl,
                        title: item.title,
                        artist: item.artist,
                        artwork: item.coverArtUrl
                    }));

                    // 4. Inyectar limpiamente en el motor
                    for (let i = nativeQueue.length - 1; i > currentTrackIndex; i--) {
                        await TrackPlayer.remove(i);
                    }
                    await TrackPlayer.add(nativeUpcoming);
                    
                    console.log(`[SHUFFLE] Cola ponderada generada. Proximas 3 canciones:`);
                    newUpcoming.slice(0, 3).forEach((track, index) => {
                        console.log(`   ${index + 1}. ${track.title}`);
                    });

                } else {
                    console.log(`[SHUFFLE] Restaurando orden cronologico original...`);
                    const upcomingOriginal = this.originalQueue.slice(currentIndexInOriginal + 1);
                    
                    const nativeUpcomingOriginal = upcomingOriginal.map(item => ({
                        id: item.id,
                        url: item.streamUrl,
                        title: item.title,
                        artist: item.artist,
                        artwork: item.coverArtUrl
                    }));

                    for (let i = nativeQueue.length - 1; i > currentTrackIndex; i--) {
                        await TrackPlayer.remove(i);
                    }
                    await TrackPlayer.add(nativeUpcomingOriginal);
                    console.log(`[SHUFFLE] Orden natural restaurado.`);
                }
            }
        } catch (error) {
            console.error("[SHUFFLE] Error al mutar la cola nativa:", error);
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
}

export const playerService = new PlayerService();