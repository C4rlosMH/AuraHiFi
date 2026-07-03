import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';

// --- Servicios ---
import { navidromeApi, Track } from '../../services/navidromeApi';
import { playerService } from '../../services/PlayerService';

// --- Estilos ---
import { styles } from './HomeScreen.styles';

export default function HomeScreen() {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchMusic = async () => {
        try {
            const data = await navidromeApi.getAllTracks();
            setTracks(data);
        } catch (error) {
            console.error("Error descargando catálogo del NAS:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMusic();
    }, []);

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await fetchMusic();
        setIsRefreshing(false);
    }, []);

    const handleToggleFavorite = async (id: string) => {
        try {
            await navidromeApi.toggleFavorite(id);
            // Actualización optimista de la UI
            setTracks(currentTracks => 
                currentTracks.map(t => 
                    t.id === id ? { ...t, starred: !t.starred } : t
                )
            );
        } catch (error) {
            console.error("Error al actualizar favorito:", error);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#00ffcc" />
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
                    <TouchableOpacity 
                        style={styles.trackCard} 
                        onPress={() => playerService.playCollection(item, tracks)}
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
                            {/* Corazón relleno si es fav, contorno si no */}
                            <Text style={[styles.likeText, item.starred && styles.likeTextActive]}>
                                {item.starred ? '♥' : '♡'}
                            </Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}