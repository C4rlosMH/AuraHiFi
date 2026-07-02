import React, { useState, useEffect } from 'react';
import { View, Modal } from 'react-native';
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

    const refreshQueueData = async () => {
        try {
            const nativeQueue = await TrackPlayer.getQueue();
            setCurrentQueue(nativeQueue);
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
        const next = !shuffleOn;
        setShuffleOn(next);
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

    // EL ENSAMBLAJE (VISTA)
    return (
        <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                
                <PlayerBackground artwork={trackInfo?.artwork} />

                <View style={styles.content}>
                    {/* 🛠️ HEADER EVOLUCIONADO CON METADATOS Y CONTROL OFF-SCENE */}
                    <PlayerHeader 
                        onClose={onClose} 
                        showLyrics={showLyrics}
                        showQueue={showQueue}
                        trackTitle={trackInfo?.title}
                        trackArtist={trackInfo?.artist}
                        artwork={trackInfo?.artwork}
                    />

                    {/* LÓGICA DE LAS 3 VISTAS CENTRALES */}
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
                            {/* Ocupa el espacio dinámico vacío manteniendo al GlassPanel abajo */}
                            <View style={{ flex: 1, width: '100%' }} />
                            <TrackLyrics /> 
                        </>
                    ) : (
                        <AlbumArtwork artwork={trackInfo?.artwork} />
                    )}

                    {/* 💎 GLASSPANEL PREMIUM CON COLAPSO VERTICAL DINÁMICO */}
                    <GlassPanel artwork={trackInfo?.artwork}>
                        {/* 🚫 OCULTAMIENTO INTELIGENTE: Si las letras o la cola están activas, 
                            escondemos TrackMetadata para que el GlassPanel reduzca su tamaño vertical */}
                        {(!showLyrics && !showQueue) && (
                            <TrackMetadata 
                                title={trackInfo?.title || 'Ninguna pista activa'} 
                                artist={trackInfo?.artist || 'Selecciona música'} 
                                isFavorite={isFavorite}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        )}
                        
                        {/* El ScrubberBar y los Controles de reproducción permanecen fijos abajo */}
                        <ScrubberBar />
                        
                        <ReproductionControls 
                            isPlaying={isPlaying}
                            shuffleOn={shuffleOn}
                            onToggleShuffle={handleToggleShuffle}
                            repeatState={repeatState}
                            onCycleRepeat={handleCycleRepeat}
                        />
                    </GlassPanel>

                    {/* CONTROLES DEL FOOTER (MANTIENEN SU FLUJO) */}
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
            </View>
        </Modal>
    );
}