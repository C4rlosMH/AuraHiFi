import React, { useState, useEffect, useRef } from 'react';
import { View, Modal, Animated, PanResponder, Dimensions, Image } from 'react-native';
import TrackPlayer, { RepeatMode, useActiveTrack } from 'react-native-track-player';

// --- Servicios ---
import { playerService } from '../../services/PlayerService';
import { localLibraryService } from '../../services/LocalLibraryService';


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
import LosslessBadge from '../../components/Player/LosslessBadge/LosslessBadge';

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
    //const [isFavorite, setIsFavorite] = useState(false);
    const [shuffleOn, setShuffleOn] = useState(false);
    const [repeatState, setRepeatState] = useState<RepeatMode>(RepeatMode.Off);
    const [showQueue, setShowQueue] = useState(false);
    const [showLyrics, setShowLyrics] = useState(false);
    const [currentQueue, setCurrentQueue] = useState<any[]>([]);
    const [isLiked, setIsLiked] = useState(false);

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
                artwork: activeTrack.artwork || '',
                //streamUrl: activeTrack.url || '' 
            });

            // 🚀 DOBLE VERIFICACIÓN (NAS + LOCAL)
            const serverLikedStatus = activeTrack.starred === true || activeTrack.starred === 'true';
            
            if (!serverLikedStatus && activeTrack.id) {
                localLibraryService.isTrackFavorited(activeTrack.id).then((isLocalFav) => {
                    setIsLiked(isLocalFav);
                });
            } else {
                // Si el servidor dijo que sí, le creemos ciegamente y prendemos el corazón
                setIsLiked(serverLikedStatus);
            }

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

    const fetchCurrentQueue = async () => {
        try {
            // 🛡️ EL TRUCO DE INGENIERÍA: Le damos 150ms al puente de Android/iOS 
            // para que consolide la memoria nativa antes de pedirle los datos.
            await new Promise(resolve => setTimeout(resolve, 150));

            const nativeQueue = await TrackPlayer.getQueue();
            const currentTrackIndex = await TrackPlayer.getActiveTrackIndex(); 
            
            if (currentTrackIndex !== undefined && currentTrackIndex !== null) {
                const formattedQueue = nativeQueue.slice(currentTrackIndex).map((track, index) => ({
                    ...track,
                    nativeIndex: currentTrackIndex + index 
                }));
                
                // ⚠️ Asegúrate de que tu estado se llame setQueue o setQueueList
                setCurrentQueue(formattedQueue); 
            }
        } catch (error) {
            console.log("Error leyendo la cola:", error);
        }
    };

    // 🚀 NUEVA ANTENA: Escucha cambios manuales en la Queue (Add / Remove / Shuffle)
    useEffect(() => {
        // 1. Escuchamos las inyecciones y eliminaciones manuales de la UI
        const unsubscribe = playerService.onQueueChange(() => {
            fetchCurrentQueue();
        });

        // 2. Cargamos la cola visualmente la primera vez que se abre la app
        fetchCurrentQueue();

        return () => unsubscribe();
    }, []);
    // MANEJADORES DE EVENTOS
    const handleToggleLike = async () => {
        // 🚀 Validamos usando directamente el hook nativo
        if (!activeTrack || !activeTrack.id) return;

        // Optimistic UI: Cambiamos el color de inmediato para mantener los 60 FPS
        const previousState = isLiked;
        setIsLiked(!isLiked); 

        try {
            // Construimos el mapeo extrayendo los datos de la pista activa
            const trackForLocal = {
                id: activeTrack.id,
                title: activeTrack.title || 'Desconocido',
                artist: activeTrack.artist || 'Artista Desconocido',
                album: activeTrack.album || '',
                duration: activeTrack.duration || 0,
                coverArtUrl: activeTrack.artwork || '',
                // Nos aseguramos de extraer el string de la URL nativa de forma segura
                streamUrl: typeof activeTrack.url === 'string' ? activeTrack.url : ''
            };

            // 1. Magia Local: Se cataloga y se inicia la descarga en segundo plano si corresponde
            await localLibraryService.handleTrackLike(trackForLocal as any);
            
            // 2. Sincronización NAS: Le avisamos a tu servidor Navidrome
            await playerService.toggleFavoriteServer(activeTrack.id);
            
        } catch (error) {
            console.error("Error al gestionar el Like:", error);
            setIsLiked(previousState); // Revertimos el icono si el almacenamiento falla
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

                    {(!showLyrics && !showQueue) && (
                        <View style={styles.losslessWrapper}>
                            <LosslessBadge />
                        </View>
                    )}

                    {/* Panel de Controles e Información */}
                    <GlassPanel artwork={trackInfo?.artwork}>
                        {(!showLyrics && !showQueue) && (
                            <TrackMetadata 
                                title={trackInfo?.title || 'Ninguna pista activa'} 
                                artist={trackInfo?.artist || 'Selecciona música'} 
                                isFavorite={isLiked}
                                onToggleFavorite={handleToggleLike}
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
                        showLyrics={showLyrics}
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