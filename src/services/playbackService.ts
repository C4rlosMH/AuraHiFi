import TrackPlayer, { Event } from 'react-native-track-player';
import { navidromeApi } from './navidromeApi'; // Ajusta la ruta segun corresponda

export const PlaybackService = async function() {
    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
    TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
    
    TrackPlayer.addEventListener(Event.RemoteNext, async () => {
        console.log("Log: Boton NEXT presionado desde la notificacion");
        try {
            await TrackPlayer.skipToNext();
        } catch (error) {
            console.log("Error al saltar de cancion (Posible cola vacia):", error);
        }
    });
    
    TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
        console.log("Log: Boton PREV presionado desde la notificacion");
        try {
            await TrackPlayer.skipToPrevious();
        } catch (error) {
            console.log("Error al retroceder cancion:", error);
        }
    });

    TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
        console.log("Log: Arrastre desde la notificación a", event.position);
        TrackPlayer.seekTo(event.position);
    });

    TrackPlayer.addEventListener(Event.PlaybackQueueEnded, async () => {
        console.log("Log: La cola de reproduccion termino. Iniciando Autoplay...");
        
        try {
            // 1. Pedimos 15 canciones aleatorias al NAS
            const randomTracks = await navidromeApi.getRandomSongs(15);
            
            if (randomTracks && randomTracks.length > 0) {
                console.log("Log: Obtenidas " + randomTracks.length + " canciones para la radio.");
                
                // 2. Formateamos al estandar del motor nativo
                const tracksToInject = randomTracks.map((t: any) => ({
                    id: t.id,
                    url: t.streamUrl,
                    title: t.title,
                    artist: t.artist,
                    artwork: t.coverArtUrl
                }));

                // 3. Anadimos las canciones a la cola nativa
                await TrackPlayer.add(tracksToInject);
                
                // 3.5 EMPUJAMOS EL CABEZAL HACIA LA MUSICA NUEVA
                await TrackPlayer.skipToNext();
                
                // 4. Forzamos el Play para que la musica no se detenga
                await TrackPlayer.play();
                
                console.log("Log: Autoplay iniciado con exito en segundo plano.");
            }
        } catch (error) {
            console.error("Log: Error al intentar iniciar el Autoplay:", error);
        }
    });
};