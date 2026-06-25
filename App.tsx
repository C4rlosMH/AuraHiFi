import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import TrackPlayer, { State } from 'react-native-track-player';

import { navidromeApi, Track } from './src/services/navidromeApi';
import { downloadManager } from './src/services/downloadManager';
import { setupTrackPlayer } from './src/services/trackPlayerSetup';
import { PlaybackService } from './src/services/playbackService';
import { styles } from './App.styles';

// 1. REGISTRO DEL SERVICIO HEADLESS
// Esto debe ejecutarse fuera del componente de React para sobrevivir cuando la app se minimiza
TrackPlayer.registerPlaybackService(() => PlaybackService);

export default function App() {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // Estados del reproductor
    const [currentTrackTitle, setCurrentTrackTitle] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPlayerReady, setIsPlayerReady] = useState(false);

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
            // Inicializamos el nuevo motor nativo de audio
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

    const playTrack = async (item: Track) => {
        if (!isPlayerReady) return;

        try {
            setCurrentTrackTitle(item.title);
            setIsPlaying(true);

            // Obtenemos la ruta del sandbox local
            const uriToPlay = await downloadManager.downloadTrack(
                item.streamUrl,
                item.title,
                item.artist
            );

            // 2. INYECCIÓN DE METADATOS AL SISTEMA NATIVO
            await TrackPlayer.reset();
            await TrackPlayer.add({
                id: item.id,
                url: uriToPlay, 
                title: item.title,
                artist: item.artist,
                artwork: item.coverArtUrl
            });

            await TrackPlayer.play();
        } catch (error) {
            console.error("Error al gestionar el track:", error);
            setIsPlaying(false);
        }
    };

    const togglePlayback = async () => {
        if (!isPlayerReady) return;

        try {
            // Obtenemos el estado actual directamente del motor nativo
            const playbackState = await TrackPlayer.getPlaybackState();
            
            if (playbackState.state === State.Playing) {
                await TrackPlayer.pause();
                setIsPlaying(false);
            } else {
                await TrackPlayer.play();
                setIsPlaying(true);
            }
        } catch (error) {
            console.error("Error al pausar/reproducir:", error);
        }
    };

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
                    <TouchableOpacity style={styles.trackCard} onPress={() => playTrack(item)}>
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

            {currentTrackTitle && (
                <View style={styles.miniPlayer}>
                    <View style={styles.miniPlayerInfo}>
                        <Text style={styles.miniPlayerTitle} numberOfLines={1}>{currentTrackTitle}</Text>
                        <Text style={styles.miniPlayerStatus}>
                            {isPlaying ? 'REPRODUCIENDO (Motor Nativo)' : 'PAUSADO'}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
                        <Text style={styles.playButtonText}>{isPlaying ? 'PAUSA' : 'PLAY'}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}