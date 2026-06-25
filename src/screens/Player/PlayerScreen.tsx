import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import TrackPlayer, { useProgress, RepeatMode } from 'react-native-track-player';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

import { playerService } from '../../services/PlayerService';
import { navidromeApi } from '../../services/navidromeApi';
import QueuePanel from '../../components/Queue/QueuePanel';
import ScrubberBar from '../../components/ScrubberBar/ScrubberBar';
import { styles } from './PlayerScreen.styles';

interface PlayerScreenProps {
    isVisible: boolean;
    onClose: () => void;
    isPlaying: boolean;
}

export default function PlayerScreen({ isVisible, onClose, isPlaying }: PlayerScreenProps) {
    const [trackInfo, setTrackInfo] = useState<{ id: string; title: string; artist: string; artwork: string } | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [shuffleOn, setShuffleOn] = useState(false);
    const [repeatState, setRepeatState] = useState<RepeatMode>(RepeatMode.Off);

    const [showQueue, setShowQueue] = useState(false);
    const [currentQueue, setCurrentQueue] = useState<any[]>([]);

    const refreshQueueData = async () => {
        try {
            const nativeQueue = await TrackPlayer.getQueue();
            const currentIndex = await TrackPlayer.getCurrentTrack();
            if (currentIndex !== null) {
                const mappedQueue = nativeQueue.map((track, index) => ({
                    ...track,
                    nativeIndex: index
                }));
                const upcomingQueue = mappedQueue.slice(currentIndex);
                setCurrentQueue(upcomingQueue);
            }
        } catch (error) {
            console.error("Error al leer la cola nativa:", error);
        }
    };

    useEffect(() => {
        async function updateCurrentTrack() {
            const currentTrackIndex = await TrackPlayer.getCurrentTrack();
            if (currentTrackIndex !== null) {
                const track = await TrackPlayer.getTrack(currentTrackIndex);
                if (track) {
                    setTrackInfo({
                        id: track.id || '',
                        title: track.title || 'Desconocido',
                        artist: track.artist || 'Artista Anonimo',
                        artwork: track.artwork || 'https://via.placeholder.com/500'
                    });
                }
            }
            if (showQueue) {
                await refreshQueueData();
            }
        }
        updateCurrentTrack();
    }, [showQueue]); // Quitamos la dependencia position === 0

    const handleToggleFavorite = async () => {
        if (!trackInfo?.id) return;
        const previousState = isFavorite;
        setIsFavorite(!previousState); 
        try {
            await navidromeApi.toggleFavorite(trackInfo.id);
        } catch (error) {
            setIsFavorite(previousState); 
        }
    };

    const handleToggleShuffle = async () => {
        const newState = await playerService.toggleShuffle();
        setShuffleOn(newState);
        if (showQueue) await refreshQueueData();
    };

    const handleToggleRepeat = async () => {
        const newMode = await playerService.toggleRepeat();
        setRepeatState(newMode);
    };

    const handleSelectTrackFromQueue = async (index: number) => {
        try {
            await TrackPlayer.skip(index);
            await TrackPlayer.play();
            await refreshQueueData();
        } catch (error) {
            console.error("Error al saltar de pista:", error);
        }
    };

    const ReproductionControls = () => (
        <View style={styles.controlsRow}>
            <TouchableOpacity onPress={handleToggleShuffle}>
                <MaterialIcons 
                    name="shuffle" 
                    size={28} 
                    color={shuffleOn ? '#00ffcc' : 'rgba(255,255,255,0.4)'} 
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => playerService.previous()}>
                <MaterialIcons name="skip-previous" size={42} color="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.playCircle} onPress={() => playerService.togglePlayback()}>
                <MaterialIcons name={isPlaying ? "pause" : "play-arrow"} size={46} color="#0a0a0c" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => playerService.next()}>
                <MaterialIcons name="skip-next" size={42} color="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleToggleRepeat}>
                <MaterialIcons 
                    name={repeatState === RepeatMode.Track ? "repeat-one" : "repeat"} 
                    size={28} 
                    color={repeatState !== RepeatMode.Off ? '#00ffcc' : 'rgba(255,255,255,0.4)'} 
                />
            </TouchableOpacity>
        </View>
    );

    return (
        <Modal visible={isVisible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
                <View style={styles.content}>
                    
                    {!showQueue ? (
                        <View style={styles.headerRow}>
                            <TouchableOpacity onPress={onClose} style={styles.glassCircle}>
                                <MaterialIcons name="keyboard-arrow-down" size={28} color="#ffffff" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.glassCircle}>
                                <MaterialIcons name="more-horiz" size={24} color="#ffffff" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.queueHeaderPanel}>
                            <View style={styles.queueHeaderLeft}>
                                <TouchableOpacity onPress={onClose}>
                                    <MaterialIcons name="keyboard-arrow-down" size={28} color="#ffffff" />
                                </TouchableOpacity>
                                <View style={styles.headerThumbnailContainer}>
                                    <Image source={{ uri: trackInfo?.artwork }} style={styles.headerThumbnail} />
                                </View>
                                <View style={styles.queueHeaderMetadata}>
                                    <Text style={styles.queueHeaderTitle} numberOfLines={1}>{trackInfo?.title}</Text>
                                    <Text style={styles.queueHeaderArtist} numberOfLines={1}>{trackInfo?.artist}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.glassCircle}>
                                <MaterialIcons name="more-horiz" size={24} color="#ffffff" />
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={{ flex: 1, justifyContent: !showQueue ? 'center' : 'flex-start' }}>
                        {!showQueue ? (
                            trackInfo && (
                                <View style={styles.albumContainer}>
                                    <Image source={{ uri: trackInfo.artwork }} style={styles.albumImage} />
                                    <View style={styles.floatingBadge}>
                                        <MaterialIcons name="cloud" size={14} color="#00ffcc" />
                                        <Text style={styles.floatingBadgeText}>LOSSLESS</Text>
                                    </View>
                                </View>
                            )
                        ) : (
                            <View style={styles.queueListContainer}>
                                <QueuePanel 
                                    queue={currentQueue}
                                    isPlaying={isPlaying}
                                    onSelectTrack={handleSelectTrackFromQueue}
                                />
                            </View>
                        )}
                    </View>

                    <View>
                        <View style={styles.glassPanel}>
                            
                            {!showQueue && (
                                <View style={styles.metaRow}>
                                    <View style={{ flex: 1, paddingRight: 10 }}>
                                        <Text style={styles.titleText} numberOfLines={1}>{trackInfo?.title}</Text>
                                        <Text style={styles.artistText}>{trackInfo?.artist}</Text>
                                    </View>
                                    <TouchableOpacity onPress={handleToggleFavorite}>
                                        <MaterialIcons 
                                            name={isFavorite ? "favorite" : "favorite-border"} 
                                            size={32} 
                                            color={isFavorite ? "#00ffcc" : "#ffffff"} 
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Inyección de nuestro nuevo componente de rendimiento óptimo */}
                            <ScrubberBar />
                            
                            <ReproductionControls />
                        </View>

                        <View style={styles.footerRow}>
                            <TouchableOpacity style={styles.footerAction}>
                                <MaterialIcons name="podcasts" size={24} color="rgba(255,255,255,0.8)" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.footerAction} onPress={() => alert('Abriendo Lector')}>
                                <MaterialIcons name="lyrics" size={24} color="rgba(255,255,255,0.8)" />
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.footerAction} 
                                onPress={() => setShowQueue(!showQueue)}
                            >
                                <MaterialIcons 
                                    name="queue-music" 
                                    size={24} 
                                    color={showQueue ? '#00ffcc' : 'rgba(255,255,255,0.8)'} 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>
        </Modal>
    );
}