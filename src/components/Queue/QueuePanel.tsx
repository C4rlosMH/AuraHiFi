import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './QueuePanel.styles';

// Interfaz limpia: Ya no exige el activeIndex
interface QueuePanelProps {
    queue: any[];
    isPlaying: boolean;
    onSelectTrack: (index: number) => void;
}

export default function QueuePanel({ queue, isPlaying, onSelectTrack }: QueuePanelProps) {
    return (
        <View style={styles.queueContainer}>
            <Text style={styles.queueHeader}>A CONTINUACIÓN</Text>
            <FlatList
                data={queue}
                keyExtractor={(item) => `${item.id}-${item.nativeIndex}`}
                style={styles.queueList}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    // La canción actual siempre es la posición 0
                    const isCurrent = index === 0; 
                    
                    return (
                        <TouchableOpacity 
                            style={[styles.queueItem, isCurrent && styles.queueItemActive]}
                            onPress={() => onSelectTrack(item.nativeIndex)}
                        >
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
                            
                            {isCurrent && (
                                <MaterialIcons 
                                    name={isPlaying ? "volume-up" : "volume-mute"} 
                                    size={20} 
                                    color="#00ffcc" 
                                />
                            )}
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}