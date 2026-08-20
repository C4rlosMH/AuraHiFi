import React, { useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useActiveTrack, useIsPlaying } from 'react-native-track-player';
import Ionicons from 'react-native-vector-icons/Ionicons'; 

import { playerService } from '../../services/PlayerService';
import { styles } from './MiniPlayer.styles';
import { colors } from '../../styles/theme'; 
import { SocketContext } from '../../context/SocketContext'; // 🚀 Importamos el puente al servidor

interface MiniPlayerProps {
    onExpand: () => void;
    isVisible: boolean; 
}

export default function MiniPlayer({ onExpand, isVisible }: MiniPlayerProps) {
    const activeTrack = useActiveTrack();
    const { playing } = useIsPlaying();
    
    // 🚀 Extraemos la función de nuestro contexto
    const { updatePresence, isConnected } = useContext(SocketContext);

    // 🚀 El motor silencioso: Cada vez que la canción o el estado de Play cambien, avisa al servidor
    useEffect(() => {
        if (!isConnected) return;

        // Solo emitimos si la canción ya tiene un título válido cargado
        if (activeTrack && activeTrack.title) {
            updatePresence({
                isPlaying: playing ?? false,
                songTitle: activeTrack.title,
                artistName: activeTrack.artist,
                albumArt: activeTrack.artwork,
                trackId: activeTrack.id
            });
        } else if (!activeTrack) {
            // Si la cola se vació por completo
            updatePresence({ isPlaying: false });
        }
        
    // 🚀 CLAVE: Dependemos del ID de la canción, no del objeto completo, 
    // para evitar que mutaciones menores de TrackPlayer repitan el evento
    }, [activeTrack?.id, playing, isConnected]);

    // Las reglas de renderizado se mantienen intactas
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