import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Track } from '../../../services/navidromeApi';
import { playerService } from '../../../services/PlayerService';
import { styles } from './CollectionTrackList.styles';

import TrackOptionsModal from '../../Common/TrackOptionsModal/TrackOptionsModal';

interface CollectionTrackListProps {
    tracks: Track[];
    onPlayTrack: (track: Track, index: number) => void;
    isFromPlaylist?: boolean;
    onRemoveFromPlaylist?: (trackId: string) => void;
}

export default function CollectionTrackList({ tracks, onPlayTrack, isFromPlaylist, onRemoveFromPlaylist }: CollectionTrackListProps) {
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

    // Almacenamiento de referencias para el autocierre del swipe
    const swipeableRefs = useRef<Map<string, any>>(new Map());

    const handleAddToQueue = async (track: Track) => {
        try {
            // 🚀 CORRECCIÓN: Usamos playNext para que sea la canción INMEDIATA siguiente
            await playerService.playNext(track);
            
            // Cerramos el swipe visualmente
            const swipeable = swipeableRefs.current.get(track.id);
            if (swipeable) {
                swipeable.close();
            }
            
            console.log(`🚀 Reproducir a continuación: ${track.title}`);
        } catch (error) {
            console.error("Error al añadir a la cola", error);
        }
    };

    const handleOpenOptions = (track: Track) => {
        setSelectedTrack(track);
        setIsModalVisible(true);
    };

    const renderLeftActions = (progress: any, dragX: any) => {
        const scale = dragX.interpolate({
            inputRange: [0, 80],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        });

        return (
            <View style={styles.addAction}>
                <Animated.View style={{ transform: [{ scale }] }}>
                    <Ionicons name="list-circle" size={26} style={styles.addActionIcon} />
                </Animated.View>
            </View>
        );
    };

    return (
        /* 🚀 CONSUMO CORRECTO DEL CONTENEDOR ORIGINAL DE LA LISTA */
        <GestureHandlerRootView style={styles.container}>
            {tracks.map((track, index) => (
                <Swipeable
                    key={`track-${track.id}`}
                    ref={(ref) => {
                        if (ref) swipeableRefs.current.set(track.id, ref);
                    }}
                    renderLeftActions={renderLeftActions}
                    onSwipeableLeftOpen={() => handleAddToQueue(track)}
                    overshootLeft={false}
                >
                    {/* 🚀 RESPETA ABSOLUTAMENTE TU LAYOUT TRACKROW ORIGINAL */}
                    <TouchableOpacity 
                        style={styles.trackRow}
                        onPress={() => onPlayTrack(track, index)}
                        activeOpacity={1} 
                    >
                        <Text style={styles.trackNumber}>{index + 1}</Text>
                        
                        <View style={styles.trackInfo}>
                            <Text style={styles.trackTitle} numberOfLines={1}>
                                {track.title}
                            </Text>
                            <Text style={styles.trackArtist} numberOfLines={1}>
                                {track.artist}
                            </Text>
                        </View>
                        
                        <TouchableOpacity 
                            style={styles.optionsButton}
                            onPress={() => handleOpenOptions(track)}
                        >
                            <Ionicons name="ellipsis-horizontal" size={20} style={styles.trackArtist} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Swipeable>
            ))}

            <TrackOptionsModal 
                isVisible={isModalVisible}
                track={selectedTrack}
                isFromPlaylist={isFromPlaylist}
                isFromAlbum={true} // <--- Así de sencillo le avisas
                onRemoveFromPlaylist={onRemoveFromPlaylist}
                onClose={() => {
                    setIsModalVisible(false);
                    setSelectedTrack(null);
                }}
            />
        </GestureHandlerRootView>
    );
}