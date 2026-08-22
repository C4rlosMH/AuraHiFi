import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer, { State, Event, useTrackPlayerEvents } from 'react-native-track-player';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- Servicios e Interfaces ---
import { navidromeApi, Album, Artist, Track } from '../../services/navidromeApi';
import { playerService } from '../../services/PlayerService';

// --- Componentes Globales ---
import AuraBackground from '../../components/AuraBackground/AuraBackground';
import HomeHeader from '../../components/Home/HomeHeader/HomeHeader';
import HorizontalSection from '../../components/Home/HorizontalSection/HorizontalSection';
import ActivityFab from '../../components/Home/ActivityFab/ActivityFab';
import TopSectionGrid from '../../components/Home/TopSectionGrid/TopSectionGrid';
import AccountSidebar from '../../components/Common/AccountSidebar/AccountSidebar';
import RadarModal from '../../components/Home/RadarModal/RadarModal';
import ResumePlaybackCard from '../../components/Home/Cards/ResumePlaybackCard';

// --- Tarjetas ---
import SquareAlbumCard from '../../components/Home/Cards/SquareAlbumCard';
import FeaturedAlbumCard from '../../components/Home/Cards/FeaturedAlbumCard';
import ArtistCircleCard from '../../components/Home/Cards/ArtistCircleCard';

import { styles } from './HomeScreen.styles';
import { colors } from '../../styles/theme';

export default function HomeScreen() {
    const navigation = useNavigation<any>();

    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isOffline, setIsOffline] = useState(false); // 🚀 ESTADO OFFLINE

    // --- Colecciones del Catálogo (Las 6 Dimensiones) ---
    const [smartTopMixes, setSmartTopMixes] = useState<any[]>([]);       
    const [mostPlayed, setMostPlayed] = useState<Album[]>([]);           
    const [recentAlbums, setRecentAlbums] = useState<Album[]>([]);       
    const [discoveryAlbums, setDiscoveryAlbums] = useState<Album[]>([]); 
    const [recommendedTracks, setRecommendedTracks] = useState<Track[]>([]); 
    const [artists, setArtists] = useState<Artist[]>([]);                
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    const [isRadarVisible, setIsRadarVisible] = useState(false);

    // --- Atajo Continuar ---
    const [lastTrack, setLastTrack] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const loadData = async () => {
        try {
            setIsOffline(false);
            const [
                playlistsRes, 
                frequentAlbumsRes, 
                recentAlbumsRes, 
                randomAlbumsRes, 
                randomSongsRes, 
                artistsRes
            ] = await Promise.all([
                navidromeApi.getPlaylists(),
                navidromeApi.getFrequentAlbums(10),
                navidromeApi.getRecentAlbums(10),
                navidromeApi.getRandomAlbums(10),
                navidromeApi.getRandomSongs(10),
                navidromeApi.getArtists()
            ]);

            const visiblePlaylists = playlistsRes
                .filter(p => p.title !== '__aura_system_library__')
                .map(p => ({ ...p, type: 'playlist' }));
            
            let topGridItems = [...visiblePlaylists];
            
            if (topGridItems.length < 6) {
                const fillCount = 6 - topGridItems.length;
                const randomFill = await navidromeApi.getRandomAlbums(fillCount);
                const mappedFill = randomFill.map(a => ({ ...a, type: 'album' }));
                topGridItems = [...topGridItems, ...mappedFill];
            }
            
            setSmartTopMixes(topGridItems);
            setMostPlayed(frequentAlbumsRes);
            setRecentAlbums(recentAlbumsRes);
            setDiscoveryAlbums(randomAlbumsRes);
            setRecommendedTracks(randomSongsRes);
            
            const shuffledArtists = [...artistsRes].sort(() => Math.random() - 0.5).slice(0, 15);
            setArtists(shuffledArtists);

        } catch (error: any) {
            // 🚀 MODO RESCATE: Si falla la red, marcamos Offline y cortamos ejecución
            if (error.message === 'OFFLINE' || error.message?.includes('Network request failed')) {
                setIsOffline(true);
            }
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
        const currentState = typeof playbackState === 'object' && 'state' in playbackState ? playbackState.state : playbackState;

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
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color="#FF3366" />
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
                    onProfilePress={() => setIsSidebarVisible(true)}
                />

                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    fadingEdgeLength={20}
                    refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#FF3366" />}
                >
                    {/* 1. EL GRID INTELIGENTE (Solo si hay conexión) */}
                    {!isOffline && smartTopMixes.length > 0 && (
                        <TopSectionGrid 
                            topMixes={smartTopMixes}
                            lastTrack={lastTrack}
                            isPlaying={isPlaying}
                            onPlayPause={handleSmartPlay}
                            onNext={() => playerService.next()}
                            onPrev={() => playerService.previous()}
                            onItemPress={(id, type) => navigation.navigate('CollectionDetail', { 
                                id, 
                                title: type === 'playlist' ? 'Playlist' : 'Álbum', 
                                type 
                            })}
                            onResumeCardPress={() => DeviceEventEmitter.emit('expandPlayer')}
                        />
                    )}

                    {/* 🚀 MODO OFFLINE UI */}
                    {isOffline && (
                        <View style={{ marginTop: 20 }}>
                            {/* Dejamos que el usuario siga dándole Play a la última canción local */}
                            {lastTrack && (
                                <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
                                    <ResumePlaybackCard 
                                        trackTitle={lastTrack?.title || "Nada reproduciéndose"}
                                        artistName={lastTrack?.artist || "Toca para mezclar"}
                                        coverUrl={lastTrack?.artwork || "https://via.placeholder.com/150"}
                                        isPlaying={isPlaying}
                                        onPlayPause={handleSmartPlay}
                                        onNext={() => playerService.next()}
                                        onPrev={() => playerService.previous()}
                                        onCardPress={() => DeviceEventEmitter.emit('expandPlayer')}
                                    />
                                </View>
                            )}

                            <View style={{ alignItems: 'center', paddingHorizontal: 30, marginTop: 20 }}>
                                <Ionicons name="cloud-offline-outline" size={64} color={colors.textMuted} />
                                <Text style={{ color: colors.primary, fontSize: 22, fontWeight: 'bold', marginTop: 15 }}>Modo Sin Conexión</Text>
                                <Text style={{ color: colors.textMuted, fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 22 }}>
                                    No pudimos conectar con Navidrome. Desliza hacia la derecha para ir a tu Biblioteca y escuchar tu música descargada.
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* 2. LO MÁS ESCUCHADO */}
                    {!isOffline && mostPlayed.length > 0 && (
                        <HorizontalSection title="Lo más escuchado">
                            {mostPlayed.map(item => (
                                <SquareAlbumCard 
                                    key={`freq-${item.id}`} 
                                    title={item.title} 
                                    subtitle={item.artist} 
                                    imageUrl={item.coverArtUrl} 
                                    onPress={() => navigation.navigate('CollectionDetail', { id: item.id, title: item.title, type: 'album' })}
                                />
                            ))}
                        </HorizontalSection>
                    )}

                    {/* 3. AÑADIDOS RECIENTEMENTE */}
                    {!isOffline && recentAlbums.length > 0 && (
                        <HorizontalSection title="Añadidos Recientes">
                            {recentAlbums.map(item => (
                                <SquareAlbumCard 
                                    key={`new-${item.id}`} 
                                    title={item.title} 
                                    subtitle={item.artist} 
                                    imageUrl={item.coverArtUrl} 
                                    onPress={() => navigation.navigate('CollectionDetail', { id: item.id, title: item.title, type: 'album' })}
                                />
                            ))}
                        </HorizontalSection>
                    )}

                    {/* 4. DESCUBRE */}
                    {!isOffline && discoveryAlbums.length > 0 && (
                        <HorizontalSection title="Descubre">
                            {discoveryAlbums.map(album => (
                                <SquareAlbumCard 
                                    key={`disc-${album.id}`} 
                                    title={album.title} 
                                    subtitle={album.artist} 
                                    imageUrl={album.coverArtUrl} 
                                    onPress={() => navigation.navigate('CollectionDetail', { id: album.id, title: album.title, type: 'album' })}
                                />
                            ))}
                        </HorizontalSection>
                    )}

                    {/* 5. RECOMENDADOS */}
                    {!isOffline && recommendedTracks.length > 0 && (
                        <HorizontalSection title="Recomendados">
                            {recommendedTracks.map(track => (
                                <FeaturedAlbumCard 
                                    key={`rec-${track.id}`} 
                                    title={track.title} 
                                    highlightText={track.artist} 
                                    imageUrl={track.coverArtUrl} 
                                    onPress={async () => {
                                        await playerService.playCollection(track, [track, ...recommendedTracks]);
                                        DeviceEventEmitter.emit('expandPlayer');
                                    }} 
                                />
                            ))}
                        </HorizontalSection>
                    )}

                    {/* 6. ARTISTAS */}
                    {!isOffline && artists.length > 0 && (
                        <HorizontalSection title="Artistas sugeridos">
                            {artists.map(item => (
                                <ArtistCircleCard 
                                    key={`art-${item.id}`} 
                                    artistName={item.name} 
                                    imageUrl={item.artistImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random`} 
                                    onPress={() => navigation.navigate('ArtistDetail', { id: item.id, name: item.name })}
                                />
                            ))}
                        </HorizontalSection>
                    )}

                    <View style={{ height: 130, width: '100%' }} />
                </ScrollView>

                <ActivityFab onPress={() => setIsRadarVisible(true)} />
            </View>

            <AccountSidebar 
                isVisible={isSidebarVisible}
                onClose={() => setIsSidebarVisible(false)}
                profilePicUrl="https://picsum.photos/seed/profile/100/100"
                userName="Usuario Local"
                serverName="Aura Server"
                onGoToSettings={() => {
                    setIsSidebarVisible(false); 
                    navigation.navigate('SettingsMain'); 
                }}
            />

            <RadarModal 
                isVisible={isRadarVisible} 
                onClose={() => setIsRadarVisible(false)} 
            />
        </AuraBackground>
    );
}