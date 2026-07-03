import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import TrackPlayer, { State, Event, useTrackPlayerEvents } from 'react-native-track-player';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Importamos la librería de iconos

import { playerService } from '../../services/PlayerService';
import { styles } from './MiniPlayer.styles';
import { colors } from '../../styles/theme'; // Importamos los colores globales

interface MiniPlayerProps {
    onExpand: () => void;
}

export default function MiniPlayer({ onExpand }: MiniPlayerProps) {
    const [trackInfo, setTrackInfo] = useState<{title: string, artist: string, artwork: string} | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.PlaybackState], async (event) => {
        if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
            const track = await TrackPlayer.getTrack(event.nextTrack);
            if (track) {
                setTrackInfo({
                    title: track.title || 'Desconocido',
                    artist: track.artist || 'Artista',
                    artwork: track.artwork as string || 'https://via.placeholder.com/150'
                });
            }
        }
        if (event.type === Event.PlaybackState) {
            setIsPlaying(event.state === State.Playing);
        }
    });

    if (!trackInfo) return null;

    return (
        <TouchableOpacity style={styles.miniPlayerContainer} onPress={onExpand}>
            <View style={styles.leftSection}>
                <Image source={{ uri: trackInfo.artwork }} style={styles.coverArt} />
                <View style={styles.trackInfo}>
                    <Text style={styles.miniPlayerTitle} numberOfLines={1}>{trackInfo.title}</Text>
                    <Text style={styles.miniPlayerArtist} numberOfLines={1}>{trackInfo.artist}</Text>
                </View>
            </View>
            
            <View style={styles.controlsContainer}>
                <TouchableOpacity onPress={() => playerService.previous()} style={styles.navButton}>
                    <Ionicons name="play-skip-back" size={24} color={colors.primary} />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.playButton} onPress={() => playerService.togglePlayback()}>
                    <Ionicons name={isPlaying ? "pause" : "play"} size={20} color={colors.background} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => playerService.next()} style={styles.navButton}>
                    <Ionicons name="play-skip-forward" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}