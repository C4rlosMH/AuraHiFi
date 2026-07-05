import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './ArtistTopTracks.styles';
import { colors } from '../../../styles/theme';
import { Track } from '../../../services/navidromeApi';

interface ArtistTopTracksProps {
    tracks: Track[];
    onPlayTrack: (track: Track, index: number) => void;
}

export default function ArtistTopTracks({ tracks, onPlayTrack }: ArtistTopTracksProps) {
    if (!tracks || tracks.length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Canciones populares</Text>
            
            {tracks.map((track, index) => (
                <TouchableOpacity 
                    key={`toptrack-${track.id}`} 
                    style={styles.trackRow}
                    onPress={() => onPlayTrack(track, index)}
                    activeOpacity={0.7}
                >
                    {/* Número de Ranking */}
                    <View style={styles.trackNumberContainer}>
                        <Text style={styles.trackNumber}>{index + 1}</Text>
                    </View>

                    {/* Mini Carátula */}
                    <Image source={{ uri: track.coverArtUrl }} style={styles.coverArt} />
                    
                    {/* Metadatos */}
                    <View style={styles.infoContainer}>
                        <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
                        <Text style={styles.trackArtist} numberOfLines={1}>{track.artist}</Text>
                    </View>

                    {/* Botón de Opciones (tres puntos) */}
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="ellipsis-horizontal" size={20} color={colors.textMuted} />
                    </TouchableOpacity>
                </TouchableOpacity>
            ))}
        </View>
    );
}