import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, RefreshControl, ActivityIndicator, DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer, { State, Event, useTrackPlayerEvents } from 'react-native-track-player';

// --- Servicios e Interfaces ---
import { navidromeApi, Album, Playlist, Artist, Track } from '../../services/navidromeApi';
import { playerService } from '../../services/PlayerService';

import { useNavigation } from '@react-navigation/native';


// --- Componentes Globales ---
import AuraBackground from '../../components/AuraBackground/AuraBackground';

// --- Componentes de Home ---
import HomeHeader from '../../components/Home/HomeHeader/HomeHeader';
import HorizontalSection from '../../components/Home/HorizontalSection/HorizontalSection';
import ActivityFab from '../../components/Home/ActivityFab/ActivityFab';
import TopSectionGrid from '../../components/Home/TopSectionGrid/TopSectionGrid';

// --- Tarjetas ---
import SquareAlbumCard from '../../components/Home/Cards/SquareAlbumCard';
import FeaturedAlbumCard from '../../components/Home/Cards/FeaturedAlbumCard';
import ArtistCircleCard from '../../components/Home/Cards/ArtistCircleCard';

// --- Estilos ---
import { styles } from './HomeScreen.styles';

export default function HomeScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // --- Estados Reales ---
    const [topMixes, setTopMixes] = useState<Playlist[]>([]);
    const [recentAlbums, setRecentAlbums] = useState<Album[]>([]);
    const [recommended, setRecommended] = useState<Track[]>([]);
    const [artists, setArtists] = useState<Artist[]>([]);

    // --- Atajo Continuar ---
    const [lastTrack, setLastTrack] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const navigation = useNavigation<any>();

    const loadData = async () => {
        try {
            const [playlistsRes, albumsRes, randomSongsRes, artistsRes] = await Promise.all([
                navidromeApi.getPlaylists(),
                navidromeApi.getRecentAlbums(10),
                navidromeApi.getRandomSongs(6),
                navidromeApi.getArtists()
            ]);

            setTopMixes(playlistsRes);
            setRecentAlbums(albumsRes);
            setRecommended(randomSongsRes);
            setArtists(artistsRes.slice(0, 10));
        } catch (error) {
            console.error("Error cargando datos en Home:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const loadPersistedTrack = async () => {
            try {
                const savedTrack = await AsyncStorage.getItem('@aura_last_track');
                if (savedTrack) {
                    setLastTrack(JSON.parse(savedTrack));
                }
            } catch (error) {
                console.log("No se pudo cargar la última canción", error);
            }
        };
        loadPersistedTrack();
        loadData();
    }, []);

    useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.PlaybackState], async (event) => {
        if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
            const track = await TrackPlayer.getTrack(event.nextTrack);
            if (track) {
                setLastTrack(track);
                await AsyncStorage.setItem('@aura_last_track', JSON.stringify(track)); 
            }
        }
        // 🚀 CORRECCIÓN: Usamos exclusivamente State.Playing
        if (event.type === Event.PlaybackState) {
            setIsPlaying(event.state === State.Playing);
        }
    });

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await loadData();
        setIsRefreshing(false);
    }, []);

    const handleSmartPlay = async () => {
        const playbackState = await TrackPlayer.getPlaybackState();
        
        // 🚀 CORRECCIÓN: Extraemos el estado de forma segura y comparamos solo con el Enum
        const currentState = typeof playbackState === 'object' && 'state' in playbackState 
            ? playbackState.state 
            : playbackState;

        if ((currentState === State.None || currentState === State.Stopped) && lastTrack) {
            await TrackPlayer.reset();
            await TrackPlayer.add([lastTrack]);
            await TrackPlayer.play();
        } else {
            playerService.togglePlayback();
        }
    };

    if (isLoading) {
        return (
            <AuraBackground>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={styles.loaderColor.color} />
                </View>
            </AuraBackground>
        );
    }

    return (
        <AuraBackground>
            <View style={styles.container}>
                <HomeHeader 
                    profilePicUrl="https://picsum.photos/seed/profile/100/100"
                    onNotificationsPress={() => navigation.navigate('Notifications')}
                />

                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    fadingEdgeLength={20} // 🚀 AQUÍ AGREGAS LA PROPIEDAD
                    refreshControl={
                        <RefreshControl 
                            refreshing={isRefreshing} 
                            onRefresh={onRefresh}
                            tintColor={styles.loaderColor.color}
                        />
                    }
                >
                    {/* El orquestador solo inyecta el componente con las propiedades necesarias */}
                    <TopSectionGrid 
                        topMixes={topMixes}
                        lastTrack={lastTrack}
                        isPlaying={isPlaying}
                        onPlayPause={handleSmartPlay}
                        onNext={() => playerService.next()}
                        onPrev={() => playerService.previous()}
                        // 🚀 3A. NAVEGACIÓN A PLAYLISTS (Navegación Anidada hacia Library)
                        onPlaylistPress={(id) => navigation.navigate('Library', { 
                            screen: 'CollectionDetail', 
                            params: { id: id, title: 'Mix' } 
                        })}
                        // 🚀 3B. NAVEGACIÓN AL REPRODUCTOR PRINCIPAL
                        onResumeCardPress={() => DeviceEventEmitter.emit('expandPlayer')}
                    />

                    {/* Añadidos Recientes */}
                    {recentAlbums.length > 0 && (
                        <HorizontalSection title="Añadidos Recientes">
                            {recentAlbums.map(item => (
                                <SquareAlbumCard 
                                    key={item.id} 
                                    title={item.title} 
                                    subtitle={item.artist} 
                                    imageUrl={item.coverArtUrl} 
                                    // 🚀 3C. NAVEGACIÓN A ÁLBUMES
                                    onPress={() => navigation.navigate('Library', { 
                                        screen: 'CollectionDetail', 
                                        params: { id: item.id, title: item.title } 
                                    })} 
                                />
                            ))}
                        </HorizontalSection>
                    )}

                    {/* Recomendados */}
                    {recommended.length > 0 && (
                        <HorizontalSection title="Recomendados">
                            {recommended.map(item => (
                                <FeaturedAlbumCard 
                                    key={item.id} 
                                    title={item.title} 
                                    highlightText={item.artist} 
                                    imageUrl={item.coverArtUrl} 
                                    onPress={async () => {
                                        // Reproducimos usando tu servicio limpio
                                        await playerService.playCollection(item, [item]);
                                        // 🚀 CAMBIO: Emitimos el evento para desplegar el Modal
                                        DeviceEventEmitter.emit('expandPlayer');
                                    }} 
                                />
                            ))}
                        </HorizontalSection>
                    )}

                    {/* Artistas */}
                    {artists.length > 0 && (
                        <HorizontalSection title="Artistas">
                            {artists.map(item => (
                                <ArtistCircleCard 
                                    key={item.id} 
                                    artistName={item.name} 
                                    imageUrl={item.artistImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random`} 
                                    // 🚀 3E. NAVEGACIÓN A ARTISTAS
                                    onPress={() => navigation.navigate('Library', { 
                                        screen: 'ArtistDetail', 
                                        params: { id: item.id, name: item.name } 
                                    })} 
                                />
                            ))}
                        </HorizontalSection>
                    )}
                </ScrollView>

                <ActivityFab onPress={() => console.log('Abrir panel de actividad')} />
            </View>
        </AuraBackground>
    );
}