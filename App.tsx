import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, DeviceEventEmitter } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TrackPlayer, { State, Event, useTrackPlayerEvents } from 'react-native-track-player';

// --- Servicios ---
import { navidromeApi } from './src/services/navidromeApi';
import { downloadManager } from './src/services/downloadManager';
import { setupTrackPlayer } from './src/services/trackPlayerSetup';


// --- Componentes ---
import AppNavigator from './src/Navigation/AppNavigator';
import MiniPlayer from './src/components/MiniPlayer/MiniPlayer'; // <--- IMPORTACIÓN
import PlayerScreen from './src/screens/Player/PlayerScreen';
import { styles } from './App.styles';
import { colors } from './src/styles/theme'

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [isFullPlayerVisible, setIsFullPlayerVisible] = useState(false);
    
    const [showMiniPlayer, setShowMiniPlayer] = useState(true);

    // 🚀 1. DEVOLVEMOS EL ESTADO DE REPRODUCCIÓN PARA LA PANTALLA GIGANTE
    const [isPlaying, setIsPlaying] = useState(false);

    useTrackPlayerEvents([Event.PlaybackState], (event) => {
        if (event.type === Event.PlaybackState) {
            setIsPlaying(event.state === State.Playing);
        }
    });

    /* useEffect(() => {
        async function initialize() {
            await setupTrackPlayer();
            setIsLoading(false);
            
            navidromeApi.getStarredTracks().then(starred => {
                if (starred.length > 0) downloadManager.downloadCollection(starred, () => {});
            }).catch(err => console.error(err));
        }
        initialize();
    }, []); */

    useEffect(() => {
        async function initialize() {
            // 🚀 1. RESTAURAMOS LA INICIALIZACIÓN DEL MOTOR (ESTO ES LO QUE SE ROMPIÓ)
            await setupTrackPlayer(); 
            setIsLoading(false);
            
            // 🚀 2. RESTAURAMOS TU LÓGICA DE DESCARGAS EN SEGUNDO PLANO
            navidromeApi.getStarredTracks().then(starred => {
                if (starred.length > 0) downloadManager.downloadCollection(starred, () => {});
            }).catch(err => console.error(err));
        }
        initialize();

        // 3. Mantenemos el escuchador para abrir el player gigante desde el Home
        const subscription = DeviceEventEmitter.addListener('expandPlayer', () => {
            setIsFullPlayerVisible(true);
        });

        return () => {
            subscription.remove();
        };
    }, []);

    if (isLoading) {
        return (
            <SafeAreaProvider>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.light} />
                    <Text style={styles.loadingText}>Conectando con el búnker NAS...</Text>
                </View>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            {/* El NavigationContainer ahora es el contenedor principal */}
            <NavigationContainer
                onStateChange={(state) => {
                    const currentRoute = state?.routes[state.index]?.name;
                    // Si en el futuro vas a 'Settings', se ocultará en automático
                    setShowMiniPlayer(currentRoute !== 'Settings');
                }}
            >
                <View style={{ flex: 1, backgroundColor: '#000000' }}>
                    
                    <AppNavigator />

                    {/* COMPONENTE MODULAR INYECTADO */}
                    {showMiniPlayer && (
                        <MiniPlayer onExpand={() => setIsFullPlayerVisible(true)} />
                    )}

                    <PlayerScreen 
                        isVisible={isFullPlayerVisible} 
                        onClose={() => setIsFullPlayerVisible(false)} 
                        isPlaying={isPlaying} 
                    />
                    
                </View>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}