import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './CollectionTrackList.styles';
import { colors } from '../../../styles/theme';

interface CollectionTrackListProps {
    tracks: any[];
    onPlayTrack: (track: any) => void;
}

export default function CollectionTrackList({ tracks, onPlayTrack }: CollectionTrackListProps) {
    if (!tracks || tracks.length === 0) return null;

    return (
        <View style={styles.container}>
            {tracks.map((track, index) => (
                <TouchableOpacity 
                    key={track.id} 
                    style={styles.trackRow} 
                    onPress={() => onPlayTrack(track)}
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
                    
                    {/* Botón de opciones por canción */}
                    <TouchableOpacity style={styles.optionsButton}>
                        <Ionicons name="ellipsis-horizontal" size={20} color={colors.textMuted} />
                    </TouchableOpacity>
                </TouchableOpacity>
            ))}
        </View>
    );
}