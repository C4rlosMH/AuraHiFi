import React, { useRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated, Image, FlatList } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Track } from '../../../services/navidromeApi';
import { playerService } from '../../../services/PlayerService';
import { styles } from './CollectionTrackList.styles';

import TrackOptionsModal from '../../Common/TrackOptionsModal/TrackOptionsModal';
import AddToPlaylistModal from '../../Common/AddToPlaylistModal/AddToPlaylistModal';

interface CollectionTrackListProps {
    tracks: Track[];
    onPlayTrack: (track: Track, index: number) => void;
    isFromPlaylist?: boolean;
    onRemoveFromPlaylist?: (trackId: string) => void;
    showCovers?: boolean;
    ListHeaderComponent?: React.ReactElement;
    listRef?: React.RefObject<any>;
}

export default function CollectionTrackList({ 
    tracks, 
    onPlayTrack, 
    isFromPlaylist, 
    onRemoveFromPlaylist, 
    showCovers,
    ListHeaderComponent,
    listRef
}: CollectionTrackListProps) {
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

    const [isPlaylistModalVisible, setIsPlaylistModalVisible] = useState(false);
    const [playlistTrackId, setPlaylistTrackId] = useState<string | null>(null);

    const swipeableRefs = useRef<Map<string, any>>(new Map());

    const handleAddToQueue = async (track: Track) => {
        try {
            await playerService.playNext(track);
            const swipeable = swipeableRefs.current.get(track.id);
            if (swipeable) {
                swipeable.close();
            }
        } catch (error) {
            console.error("Error al añadir a la cola", error);
        }
    };

    const handleOpenOptions = (track: Track) => {
        setSelectedTrack(track);
        setIsModalVisible(true);
    };

    const handleAddToPlaylist = (trackId: string) => {
        setPlaylistTrackId(trackId);
        setTimeout(() => {
            setIsPlaylistModalVisible(true);
        }, 300);
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

    const renderItem = useCallback(({ item: track, index }: { item: Track, index: number }) => (
        // 🚀 Aplicamos el padding de 20px SOLO a cada fila de canción
        <View style={styles.trackWrapper}>
            <Swipeable
                key={`track-${track.id}`}
                ref={(ref) => {
                    if (ref) swipeableRefs.current.set(track.id, ref);
                }}
                renderLeftActions={renderLeftActions}
                onSwipeableLeftOpen={() => handleAddToQueue(track)}
                overshootLeft={false}
            >
                <TouchableOpacity 
                    style={styles.trackRow}
                    onPress={() => onPlayTrack(track, index)}
                    activeOpacity={1} 
                >
                    <Text style={styles.trackNumber}>{index + 1}</Text>
                    {showCovers && (track.coverArtUrl || (track as any).artwork) && (
                        <Image 
                            source={{ uri: track.coverArtUrl || (track as any).artwork }} 
                            style={styles.coverArt} 
                        />
                    )}
                    <View style={styles.trackInfo}>
                        <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
                        <Text style={styles.trackArtist} numberOfLines={1}>{track.artist}</Text>
                    </View>
                    
                    <TouchableOpacity 
                        style={styles.optionsButton}
                        onPress={() => handleOpenOptions(track)}
                    >
                        <Ionicons name="ellipsis-horizontal" size={20} style={styles.trackArtist} />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Swipeable>
        </View>
    ), [showCovers, onPlayTrack]);

    return (
        <GestureHandlerRootView style={styles.container}>
            <FlatList
                ref={listRef}
                data={tracks}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListHeaderComponent={ListHeaderComponent}
                initialNumToRender={12}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={true}
                showsVerticalScrollIndicator={false}
                // 🚀 Usamos la clase del archivo .styles.ts (¡Cero estilos en línea!)
                contentContainerStyle={styles.listContent}
            />

            <TrackOptionsModal 
                isVisible={isModalVisible}
                track={selectedTrack}
                isFromPlaylist={isFromPlaylist}
                isFromAlbum={!isFromPlaylist} 
                onRemoveFromPlaylist={onRemoveFromPlaylist}
                onAddToPlaylist={handleAddToPlaylist}
                onClose={() => {
                    setIsModalVisible(false);
                    setSelectedTrack(null);
                }}
            />
            <AddToPlaylistModal 
                isVisible={isPlaylistModalVisible}
                trackId={playlistTrackId}
                onClose={() => setIsPlaylistModalVisible(false)}
            />
        </GestureHandlerRootView>
    );
}