import TrackPlayer, { Event } from 'react-native-track-player';

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
};