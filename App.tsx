import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, DeviceEventEmitter } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TrackPlayer, { State, Event, useTrackPlayerEvents } from 'react-native-track-player';

// --- Contexto de Autenticación ---
import { AuthProvider } from './src/context/AuthContext'; // 🚀 NUEVA IMPORTACIÓN

// --- Servicios ---
import { navidromeApi } from './src/services/navidromeApi';
import { downloadManager } from './src/services/downloadManager';
import { setupTrackPlayer } from './src/services/trackPlayerSetup';

// --- Componentes ---
import AppNavigator from './src/Navigation/AppNavigator';
import MiniPlayer from './src/components/MiniPlayer/MiniPlayer'; 
import PlayerScreen from './src/screens/Player/PlayerScreen';
import { styles } from './App.styles';
import { colors } from './src/styles/theme';

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [isFullPlayerVisible, setIsFullPlayerVisible] = useState(false);
    const [showMiniPlayer, setShowMiniPlayer] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);

    useTrackPlayerEvents([Event.PlaybackState], (event) => {
        if (event.type === Event.PlaybackState) {
            setIsPlaying(event.state === State.Playing);
        }
    });

    useEffect(() => {
        async function initialize() {
            await setupTrackPlayer(); 
            setIsLoading(false);
            
            // Nota: Aquí podrías querer envolver esto en un if(user) más adelante 
            // para que solo descargue si alguien ya inició sesión.
            try {
                const starred = await navidromeApi.getStarredTracks();
                if (starred.length > 0) downloadManager.downloadCollection(starred, () => {});
            } catch(err) {
                console.log("Esperando inicio de sesión para descargar favoritos...");
            }
        }
        initialize();

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
        // 🚀 ENVOLVEMOS TODO CON EL PROVEEDOR DE AUTENTICACIÓN
        <AuthProvider>
            <SafeAreaProvider>
                <NavigationContainer
                    onStateChange={(state) => {
                        if (!state) return;

                        const getActiveRouteName = (routeState: any): string => {
                            const route = routeState.routes[routeState.index];
                            if (route.state) {
                                return getActiveRouteName(route.state);
                            }
                            return route.name;
                        };

                        const currentRoute = getActiveRouteName(state);

                        const hiddenMiniPlayerScreens = [
                            'SettingsMain', 
                            'AudioSettings', 
                            'StorageSettings',
                            'Login',  // 🚀 OCULTAR EN LOGIN
                            'SignUp'  // 🚀 OCULTAR EN REGISTRO
                        ];

                        setShowMiniPlayer(!hiddenMiniPlayerScreens.includes(currentRoute));
                    }}
                >
                    <View style={{ flex: 1, backgroundColor: '#000000' }}>
                        
                        <AppNavigator />

                        {showMiniPlayer && (
                            <MiniPlayer 
                                onExpand={() => setIsFullPlayerVisible(true)} 
                                isVisible={showMiniPlayer} 
                            />
                        )}

                        <PlayerScreen 
                            isVisible={isFullPlayerVisible} 
                            onClose={() => setIsFullPlayerVisible(false)} 
                            isPlaying={isPlaying} 
                        />
                        
                    </View>
                </NavigationContainer>
            </SafeAreaProvider>
        </AuthProvider>
    );
}