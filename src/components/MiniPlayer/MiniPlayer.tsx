import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useActiveTrack, useIsPlaying } from 'react-native-track-player';
import Ionicons from 'react-native-vector-icons/Ionicons'; 

import { playerService } from '../../services/PlayerService';
import { styles } from './MiniPlayer.styles';
import { colors } from '../../styles/theme'; 

interface MiniPlayerProps {
    onExpand: () => void;
    isVisible: boolean; // 🚀 Nueva propiedad para ocultarlo sin destruirlo
}

export default function MiniPlayer({ onExpand, isVisible }: MiniPlayerProps) {
    // 🚀 Hooks modernos que siempre saben qué está sonando
    const activeTrack = useActiveTrack();
    const { playing } = useIsPlaying();

    // Si le ordenamos ocultarse o si no hay música en la memoria, no renderiza nada
    if (!isVisible || !activeTrack) return null;

    return (
        <TouchableOpacity style={styles.miniPlayerContainer} onPress={onExpand}>
            <View style={styles.leftSection}>
                <Image 
                    source={{ uri: activeTrack.artwork || 'https://via.placeholder.com/150' }} 
                    style={styles.coverArt} 
                />
                <View style={styles.trackInfo}>
                    <Text style={styles.miniPlayerTitle} numberOfLines={1}>
                        {activeTrack.title || 'Desconocido'}
                    </Text>
                    <Text style={styles.miniPlayerArtist} numberOfLines={1}>
                        {activeTrack.artist || 'Artista'}
                    </Text>
                </View>
            </View>
            
            <View style={styles.controlsContainer}>
                <TouchableOpacity onPress={() => playerService.previous()} style={styles.navButton}>
                    <Ionicons name="play-skip-back" size={24} color={colors.primary} />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.playButton} onPress={() => playerService.togglePlayback()}>
                    <Ionicons name={playing ? "pause" : "play"} size={20} color={colors.background} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => playerService.next()} style={styles.navButton}>
                    <Ionicons name="play-skip-forward" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}