import React, { useState, useEffect, useRef } from 'react';
import { View, Modal, Animated, PanResponder, Dimensions } from 'react-native';
import TrackPlayer, { RepeatMode, useActiveTrack } from 'react-native-track-player';

// --- Servicios ---
import { playerService } from '../../services/PlayerService';

// --- Componentes Modulares ---
import PlayerBackground from '../../components/Player/PlayerBackground/PlayerBackground';
import PlayerHeader from '../../components/Player/PlayerHeader/PlayerHeader';
import AlbumArtwork from '../../components/Player/AlbumArtwork/AlbumArtwork';
import GlassPanel from '../../components/Player/GlassPanel/GlassPanel';
import TrackMetadata from '../../components/Player/Metadata/TrackMetadata';
import ScrubberBar from '../../components/Player/ScrubberBar/ScrubberBar';
import ReproductionControls from '../../components/Player/Controls/ReproductionControls';
import FooterActions from '../../components/Player/FooterActions/FooterActions';
import QueuePanel from '../../components/Player/Queue/QueuePanel';
import TrackLyrics from '../../components/Player/Lyrics/TrackLyrics';

// --- Estilos ---
import { styles } from './PlayerScreen.styles';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface PlayerScreenProps {
    isVisible: boolean;
    onClose: () => void;
    isPlaying: boolean;
}

export default function PlayerScreen({ isVisible, onClose, isPlaying }: PlayerScreenProps) {
    // ESTADOS Y LÓGICA
    const [trackInfo, setTrackInfo] = useState<{ id: string; title: string; artist: string; artwork: string } | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [shuffleOn, setShuffleOn] = useState(false);
    const [repeatState, setRepeatState] = useState<RepeatMode>(RepeatMode.Off);
    const [showQueue, setShowQueue] = useState(false);
    const [showLyrics, setShowLyrics] = useState(false);
    const [currentQueue, setCurrentQueue] = useState<any[]>([]);

    const activeTrack = useActiveTrack();

    // GESTOS Y ANIMACIONES
    const translateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isVisible) {
            translateY.setValue(0);
        }
    }, [isVisible]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return gestureState.dy > 10 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
            },
            onPanResponderMove: (evt, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dy > 120 || gestureState.vy > 0.5) {
                    Animated.timing(translateY, {
                        toValue: SCREEN_HEIGHT,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => {
                        onClose();
                    });
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        friction: 6,
                        tension: 40,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    const refreshQueueData = async () => {
        try {
            const nativeQueue = await TrackPlayer.getQueue();
            const currentIndex = await TrackPlayer.getCurrentTrack();

            if (currentIndex !== null && currentIndex !== undefined) {
                const upcomingTracks = nativeQueue.slice(currentIndex).map((track, idx) => ({
                    ...track,
                    nativeIndex: currentIndex + idx 
                }));
                setCurrentQueue(upcomingTracks);
            } else {
                setCurrentQueue([]);
            }
        } catch (e) {
            console.error('Error al refrescar cola:', e);
        }
    };

    useEffect(() => {
        if (!isVisible) return;
        if (activeTrack) {
            setTrackInfo({
                id: activeTrack.id || '',
                title: activeTrack.title || 'Desconocido',
                artist: activeTrack.artist || 'Artista Desconocido',
                artwork: activeTrack.artwork || ''
            });
            setIsFavorite(false);
        } else {
            setTrackInfo(null);
        }
        refreshQueueData();
    }, [activeTrack, isVisible]);

    useEffect(() => {
        const syncPlaybackParams = async () => {
            if (!isVisible) return;
            try {
                const mode = await TrackPlayer.getRepeatMode();
                setRepeatState(mode);
            } catch (e) {
                console.log(e);
            }
        };
        syncPlaybackParams();
    }, [isVisible]);

    // MANEJADORES DE EVENTOS
    const handleToggleFavorite = async () => {
        if (!trackInfo?.id) return;
        const nextState = !isFavorite;
        setIsFavorite(nextState); 
        try {
            await playerService.toggleFavoriteServer(trackInfo.id);
        } catch (err) {
            setIsFavorite(!nextState); 
            console.error('Error toggling favorite:', err);
        }
    };

    const handleToggleShuffle = async () => {
        try {
            const newState = await playerService.toggleShuffle();
            setShuffleOn(newState);
            await refreshQueueData();
        } catch (error) {
            console.error("Error al sincronizar el Shuffle con la UI:", error);
        }
    };

    const handleCycleRepeat = async () => {
        let nextMode = RepeatMode.Off;
        if (repeatState === RepeatMode.Off) nextMode = RepeatMode.Queue;
        else if (repeatState === RepeatMode.Queue) nextMode = RepeatMode.Track;
        
        setRepeatState(nextMode);
        try {
            await TrackPlayer.setRepeatMode(nextMode);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={onClose}>
            {/* 🚀 SOLUCIÓN: El Animated.View ahora es el contenedor RAÍZ. Todo bajará al mismo tiempo */}
            <Animated.View style={[styles.modalContainer, { transform: [{ translateY: translateY }] }]}>
                
                {/* 🎨 El fondo ahora está DENTRO del bloque animado */}
                <PlayerBackground artwork={trackInfo?.artwork} />

                {/* El contenedor de contenido vuelve a ser un View normal */}
                <View style={styles.content}>
                    
                    {/* Zona limpia del Gesto del Header */}
                    <View {...panResponder.panHandlers} style={styles.headerGestureContainer}>
                        <PlayerHeader 
                            onClose={onClose} 
                            showLyrics={showLyrics}
                            showQueue={showQueue}
                            trackTitle={trackInfo?.title}
                            trackArtist={trackInfo?.artist}
                            artwork={trackInfo?.artwork}
                        />
                    </View>

                    {/* Vistas Centrales Dinámicas */}
                    {showQueue ? (
                        <View style={styles.queueListContainer}>
                            <QueuePanel 
                                queue={currentQueue} 
                                isPlaying={isPlaying}
                                onSelectTrack={async (index) => {
                                    try {
                                        await TrackPlayer.skip(index);
                                        await TrackPlayer.play();
                                    } catch (error) {
                                        console.log("Error al saltar en la cola:", error);
                                    }
                                }}
                            />
                        </View>
                    ) : showLyrics ? (
                        <>
                            <View style={styles.lyricsSpacer} />
                            <TrackLyrics /> 
                        </>
                    ) : (
                        /* Zona limpia del Gesto de la Portada */
                        <View {...panResponder.panHandlers} style={styles.artworkGestureContainer}>
                            <AlbumArtwork artwork={trackInfo?.artwork} />
                        </View>
                    )}

                    {/* Panel de Controles e Información */}
                    <GlassPanel artwork={trackInfo?.artwork}>
                        {(!showLyrics && !showQueue) && (
                            <TrackMetadata 
                                title={trackInfo?.title || 'Ninguna pista activa'} 
                                artist={trackInfo?.artist || 'Selecciona música'} 
                                isFavorite={isFavorite}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        )}
                        
                        <ScrubberBar />
                        
                        <ReproductionControls 
                            isPlaying={isPlaying}
                            shuffleOn={shuffleOn}
                            onToggleShuffle={handleToggleShuffle}
                            repeatState={repeatState}
                            onCycleRepeat={handleCycleRepeat}
                        />
                    </GlassPanel>

                    {/* Footer */}
                    <FooterActions 
                        showQueue={showQueue}
                        onToggleQueue={() => {
                            setShowQueue(!showQueue);
                            if (showLyrics) setShowLyrics(false);
                        }}
                        onOpenLyrics={() => {
                            setShowLyrics(!showLyrics);
                            if (showQueue) setShowQueue(false);
                        }}
                    />
                </View>
            </Animated.View>
        </Modal>
    );
}