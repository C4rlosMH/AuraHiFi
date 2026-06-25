import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './QueuePanel.styles';

interface QueuePanelProps {
    queue: any[];
    activeIndex: number | null;
    isPlaying: boolean;
    onSelectTrack: (index: number) => void;
}

export default function QueuePanel({ queue, activeIndex, isPlaying, onSelectTrack }: QueuePanelProps) {
    return (
        <View style={styles.queueContainer}>
            <Text style={styles.queueHeader}>SIGUIENTES</Text>
            <FlatList
                data={queue}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                style={styles.queueList}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    const isCurrent = index === activeIndex;
                    return (
                        <TouchableOpacity 
                            style={[styles.queueItem, isCurrent && styles.queueItemActive]}
                            onPress={() => onSelectTrack(index)}
                        >
                            <Text style={styles.queueIndex}>{index + 1}</Text>
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
                            {isCurrent && isPlaying && (
                                <MaterialIcons name="volume-up" size={18} color="#00ffcc" />
                            )}
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}