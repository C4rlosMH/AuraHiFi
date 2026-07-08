import React, { useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Animated, Alert } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
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

// ========================================================
// 🚀 COMPONENTE PRINCIPAL (QUEUE PANEL)
// ========================================================
interface QueuePanelProps {
    queue: any[];
    isPlaying: boolean;
    onSelectTrack: (index: number) => void;
    onQueueUpdate?: () => void; 
}

export default function QueuePanel({ queue, isPlaying, onSelectTrack, onQueueUpdate }: QueuePanelProps) {
    
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
                    {/* 🚀 CORRECCIÓN: Estilo de color inyectado limpiamente desde styles.ts */}
                    <Ionicons name="trash" size={22} style={styles.deleteIcon} />
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <GestureHandlerRootView style={styles.queueContainer}>
            <Text style={styles.queueHeader}>A CONTINUACIÓN</Text>
            <FlatList
                data={queue}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                style={styles.queueList}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    const isCurrent = index === 0; 
                    const nativeIndex = item.nativeIndex !== undefined ? item.nativeIndex : index;
                    
                    return (
                        <Swipeable
                            renderRightActions={(progress, dragX) => isCurrent ? null : renderRightActions(progress, dragX, nativeIndex)}
                            overshootRight={false}
                        >
                            <TouchableOpacity 
                                style={[styles.queueItem, isCurrent && styles.queueItemActive]}
                                onPress={() => onSelectTrack(nativeIndex)}
                                activeOpacity={1} 
                            >
                                {item.artwork ? (
                                    <Image source={{ uri: item.artwork }} style={styles.coverArt} />
                                ) : (
                                    <View style={styles.coverArt}>
                                        {/* 🚀 CORRECCIÓN: Estilo de color inyectado limpiamente desde styles.ts */}
                                        <Ionicons name="musical-notes" size={20} style={styles.placeholderIcon} />
                                    </View>
                                )}

                                <View style={styles.queueTextContainer}>
                                    <Text 
                                        style={[styles.queueTitle, isCurrent && styles.queueTitleActive]}
                                        numberOfLines={1}
                                    >
                                        {item.title}
                                    </Text>
                                    <Text style={styles.queueArtist} numberOfLines={1}>
                                        {item.artist}
                                    </Text>
                                </View>
                                
                                {isCurrent && <PlayingIndicator isPlaying={isPlaying} />}
                            </TouchableOpacity>
                        </Swipeable>
                    );
                }}
            />
        </GestureHandlerRootView>
    );
}