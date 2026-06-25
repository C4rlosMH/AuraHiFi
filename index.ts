import { registerRootComponent } from 'expo';
import TrackPlayer from 'react-native-track-player';
import App from './App';
import { PlaybackService } from './src/services/playbackService';

// Registramos la interfaz gráfica
registerRootComponent(App);

// Registramos el motor de audio en segundo plano a nivel global
TrackPlayer.registerPlaybackService(() => PlaybackService);