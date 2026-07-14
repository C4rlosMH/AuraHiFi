import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import DraggableFlatList, { ScaleDecorator, RenderItemParams } from 'react-native-draggable-flatlist';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { styles } from './QueuePanel.styles';
import { playerService } from '../../../services/PlayerService';

// ========================================================
// 🚀 ECUALIZADOR ANIMADO NATIVO
// ========================================================
const PlayingIndicator = ({ isPlaying }: { isPlaying: boolean }) => {
    const bar1 = useRef(new Animated.Value(0.3)).current;
    const bar2 = useRef(new Animated.Value(0.6)).current;
    const bar3 = useRef(new Animated.Value(0.4)).current;
    const bar4 = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        if (isPlaying) {
            const animate = (anim: Animated.Value, duration: number) => {
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(anim, { toValue: 1, duration, useNativeDriver: true }),
                        Animated.timing(anim, { toValue: 0.3, duration, useNativeDriver: true })
                    ])
                ).start();
            };
            animate(bar1, 400);
            animate(bar2, 250);
            animate(bar3, 350);
            animate(bar4, 300);
        } else {
            bar1.stopAnimation(); bar2.stopAnimation(); bar3.stopAnimation(); bar4.stopAnimation();
            Animated.spring(bar1, { toValue: 0.2, useNativeDriver: true }).start();
            Animated.spring(bar2, { toValue: 0.2, useNativeDriver: true }).start();
            Animated.spring(bar3, { toValue: 0.2, useNativeDriver: true }).start();
            Animated.spring(bar4, { toValue: 0.2, useNativeDriver: true }).start();
        }
    }, [isPlaying]);

    return (
        <View style={styles.playingIndicator}>
            <Animated.View style={[styles.eqBar, { transform: [{ scaleY: bar1 }] }]} />
            <Animated.View style={[styles.eqBar, { transform: [{ scaleY: bar2 }] }]} />
            <Animated.View style={[styles.eqBar, { transform: [{ scaleY: bar3 }] }]} />
            <Animated.View style={[styles.eqBar, { transform: [{ scaleY: bar4 }] }]} />
        </View>
    );
};

interface QueuePanelProps {
    queue: any[];
    isPlaying: boolean;
    onSelectTrack: (index: number) => void;
    onQueueUpdate?: () => void; 
    onReorder?: (newData: any[], from: number, to: number) => void;
}

export default function QueuePanel({ queue, isPlaying, onSelectTrack, onQueueUpdate, onReorder }: QueuePanelProps) {
    
    const handleDelete = async (trackIndex: number) => {
        const success = await playerService.removeFromQueue(trackIndex);
        if (success) {
            if (onQueueUpdate) onQueueUpdate();
        } else {
            Alert.alert("Error", "No se pudo eliminar la pista de la cola.");
        }
    };

    const renderRightActions = (progress: any, dragX: any, trackIndex: number) => {
        const scale = dragX.interpolate({
            inputRange: [-80, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });

        return (
            <TouchableOpacity 
                style={styles.deleteAction} 
                onPress={() => handleDelete(trackIndex)}
                activeOpacity={0.8}
            >
                <Animated.View style={[styles.deleteIconAnimated, { transform: [{ scale }] }]}>
                    <Ionicons name="trash" size={22} style={styles.deleteIcon} />
                </Animated.View>
            </TouchableOpacity>
        );
    };

    const renderItem = ({ item, drag, isActive }: RenderItemParams<any>) => {
        const nativeIndex = item.nativeIndex !== undefined ? item.nativeIndex : 0;
        
        return (
            <ScaleDecorator activeScale={1.03}>
                <Swipeable
                    renderRightActions={(progress, dragX) => isActive ? null : renderRightActions(progress, dragX, nativeIndex)}
                    overshootRight={false}
                    enabled={!isActive}
                    friction={2}
                    containerStyle={isActive ? { 
                        backgroundColor: '#1A1A1E', 
                        elevation: 10, 
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 5 },
                        shadowOpacity: 0.4,
                        shadowRadius: 6,
                        borderRadius: 8
                    } : {}}
                >
                    <TouchableOpacity 
                        style={styles.queueItem}
                        onPress={() => onSelectTrack(nativeIndex)}
                        activeOpacity={0.9} 
                    >
                        {item.artwork ? (
                            <Image source={{ uri: item.artwork }} style={styles.coverArt} />
                        ) : (
                            <View style={styles.coverArt}>
                                <Ionicons name="musical-notes" size={20} style={styles.placeholderIcon} />
                            </View>
                        )}

                        <View style={styles.queueTextContainer}>
                            <Text style={styles.queueTitle} numberOfLines={1}>
                                {item.title ? String(item.title) : 'Desconocido'}
                            </Text>
                            <Text style={styles.queueArtist} numberOfLines={1}>
                                {item.artist ? String(item.artist) : 'Artista Desconocido'}
                            </Text>
                        </View>
                        
                        <TouchableOpacity 
                            onPressIn={drag} 
                            style={{ paddingHorizontal: 15, paddingVertical: 10, justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Ionicons name="reorder-three" size={26} color={isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.5)"} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Swipeable>
            </ScaleDecorator>
        );
    };

    const currentTrack = queue.length > 0 ? queue[0] : null;
    const upcomingTracks = queue.length > 1 ? queue.slice(1) : [];

    // 🚀 LA SOLUCIÓN DEL ESPACIO: Convertimos la pista actual en el "Header" dinámico de la lista
    const renderHeader = () => {
        if (!currentTrack) return null;
        
        return (
            <View style={{ marginBottom: 15 }}>
                <Text style={styles.queueHeader}>REPRODUCIENDO AHORA</Text>
                <TouchableOpacity 
                    style={[styles.queueItem, styles.queueItemActive]}
                    onPress={() => onSelectTrack(currentTrack.nativeIndex !== undefined ? currentTrack.nativeIndex : 0)}
                    activeOpacity={1} 
                >
                    {currentTrack.artwork ? (
                        <Image source={{ uri: currentTrack.artwork }} style={styles.coverArt} />
                    ) : (
                        <View style={styles.coverArt}>
                            <Ionicons name="musical-notes" size={20} style={styles.placeholderIcon} />
                        </View>
                    )}

                    <View style={styles.queueTextContainer}>
                        <Text style={[styles.queueTitle, styles.queueTitleActive]} numberOfLines={1}>
                            {currentTrack.title ? String(currentTrack.title) : 'Desconocido'}
                        </Text>
                        <Text style={styles.queueArtist} numberOfLines={1}>
                            {currentTrack.artist ? String(currentTrack.artist) : 'Artista Desconocido'}
                        </Text>
                    </View>
                    
                    <PlayingIndicator isPlaying={isPlaying} />
                </TouchableOpacity>

                {upcomingTracks.length > 0 && (
                    <Text style={[styles.queueHeader, { marginTop: 20 }]}>A CONTINUACIÓN</Text>
                )}
            </View>
        );
    };

    return (
        <View style={[styles.queueContainer, { flex: 1 }]}>
            <DraggableFlatList
                // 🚀 AQUÍ OCURRE LA MAGIA: El Header hace scroll junto con el resto
                ListHeaderComponent={renderHeader}
                data={upcomingTracks}
                keyExtractor={(item) => `track-${item.id}-${item.nativeIndex}`}
                style={styles.queueList}
                containerStyle={{ flex: 1 }} 
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
                animationConfig={{ damping: 20, mass: 0.1, stiffness: 100, overshootClamping: false }}
                onDragEnd={({ data, from, to }) => {
                    if (onReorder) {
                        const newFullQueue = [currentTrack, ...data];
                        onReorder(newFullQueue, from + 1, to + 1);
                    }
                }}
            />
            {queue.length <= 1 && (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -50 }}>
                     <Text style={{ color: 'rgba(255,255,255,0.4)' }}>No hay más canciones en la cola.</Text>
                </View>
            )}
        </View>
    );
}