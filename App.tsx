import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import TrackPlayer, { State, Event, useTrackPlayerEvents } from 'react-native-track-player';

// Importación de nuestros servicios
import { navidromeApi, Track } from './src/services/navidromeApi';
import { downloadManager } from './src/services/downloadManager';
import { setupTrackPlayer } from './src/services/trackPlayerSetup';
import { PlaybackService } from './src/services/playbackService';
import { playerService } from './src/services/PlayerService';

// Importación de nuestras pantallas y estilos
import PlayerScreen from './src/screens/Player/PlayerScreen';
import { styles } from './App.styles'; // <-- ESTA ES LA LÍNEA QUE FALTA

// 1. REGISTRO DEL SERVICIO HEADLESS (Fondo)
TrackPlayer.registerPlaybackService(() => PlaybackService);

export default function App() {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // Estados de UI sincronizados
    const [currentTrackTitle, setCurrentTrackTitle] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    
    // Estado para controlar si el reproductor gigante está abierto o cerrado
    const [isFullPlayerVisible, setIsFullPlayerVisible] = useState(false);

    const fetchMusic = async () => {
        const data = await navidromeApi.getAllTracks();
        setTracks(data);
    };

    const syncFavoritesInBackground = async () => {
        try {
            console.log("Iniciando sincronizacion en segundo plano de Favoritos...");
            const starred = await navidromeApi.getStarredTracks();
            if (starred.length > 0) {
                await downloadManager.downloadCollection(starred, (downloaded, total) => {
                    console.log(`Sincronizando Favoritos offline: ${downloaded}/${total}`);
                });
            }
        } catch (error) {
            console.error("Error en la sincronizacion automatica:", error);
        }
    };

    useEffect(() => {
        async function initialize() {
            const setupSuccess = await setupTrackPlayer();
            setIsPlayerReady(setupSuccess);

            await fetchMusic();
            setIsLoading(false);
            
            syncFavoritesInBackground();
        }
        initialize();
    }, []);

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await fetchMusic();
        setIsRefreshing(false);
    }, []);

    // 2. HOOK DE ESCUCHA (Sincronización Reactiva UI-Motor)
    useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.PlaybackState], async (event) => {
        if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
            const track = await TrackPlayer.getTrack(event.nextTrack);
            setCurrentTrackTitle(track?.title || 'Desconocido');
        }
        if (event.type === Event.PlaybackState) {
            setIsPlaying(event.state === State.Playing);
        }
    });

    const handleToggleFavorite = async (id: string) => {
        try {
            await navidromeApi.toggleFavorite(id);
            console.log("Estado de favorito actualizado en Navidrome para el ID:", id);
        } catch (error) {
            console.error("Error al interactuar con el boton de favoritos:", error);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#00ffcc" />
                <Text style={styles.loadingText}>Conectando con el búnker...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>AURA HI-FI</Text>
            
            <FlatList
                data={tracks}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl 
                        refreshing={isRefreshing} 
                        onRefresh={onRefresh}
                        tintColor="#00ffcc"
                        colors={['#00ffcc']}
                        progressBackgroundColor="#1a1a1a"
                    />
                }
                renderItem={({ item }) => (
                    // 3. ENVIAMOS LA LÓGICA AL SERVICIO EXTERNO
                    <TouchableOpacity 
                        style={styles.trackCard} 
                        onPress={() => {
                            if (isPlayerReady) playerService.playCollection(item, tracks);
                        }}
                    >
                        <Image source={{ uri: item.coverArtUrl }} style={styles.coverImage} />
                        <View style={styles.trackInfo}>
                            <Text style={styles.trackTitle} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.trackArtist}>{item.artist} - {item.album}</Text>
                        </View>
                        
                        <TouchableOpacity 
                            onPress={() => handleToggleFavorite(item.id)}
                            style={styles.likeButton}
                        >
                            <Text style={styles.likeText}>[FAV]</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />

            {/* 4. MINI PLAYER (Abre la pantalla gigante) */}
            {currentTrackTitle && (
                <TouchableOpacity 
                    style={styles.miniPlayer} 
                    onPress={() => setIsFullPlayerVisible(true)} // Activa el modal gigante
                >
                    <View style={styles.miniPlayerInfo}>
                        <Text style={styles.miniPlayerTitle} numberOfLines={1}>{currentTrackTitle}</Text>
                        <Text style={styles.miniPlayerStatus}>
                            {isPlaying ? 'REPRODUCIENDO' : 'PAUSADO'}
                        </Text>
                    </View>
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                        <TouchableOpacity onPress={() => playerService.previous()} style={{ padding: 10 }}>
                            <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>⏮</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.playButton} onPress={() => playerService.togglePlayback()}>
                            <Text style={styles.playButtonText}>{isPlaying ? 'PAUSA' : 'PLAY'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => playerService.next()} style={{ padding: 10 }}>
                            <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>⏭</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            )}

            {/* 5. PANTALLA GIGANTE DEL REPRODUCTOR (Modal) */}
            <PlayerScreen 
                isVisible={isFullPlayerVisible} 
                onClose={() => setIsFullPlayerVisible(false)} 
                isPlaying={isPlaying}
            />
        </View>
    );
}