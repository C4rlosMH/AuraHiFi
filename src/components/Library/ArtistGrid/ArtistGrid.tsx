import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles, cardWidth } from './ArtistGrid.styles';
import { colors } from '../../../styles/theme';
import { Artist } from '../../../services/navidromeApi';

interface ArtistGridProps {
    data: Artist[];
    onItemPress: (id: string, name: string) => void;
}

export default function ArtistGrid({ data, onItemPress }: ArtistGridProps) {
    if (!data || data.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.grid}>
                {data.map((artist) => (
                    <TouchableOpacity
                        key={`artist-${artist.id}`}
                        style={styles.artistCard}
                        onPress={() => onItemPress(artist.id, artist.name)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.imageContainer}>
                            {artist.artistImageUrl ? (
                                <Image source={{ uri: artist.artistImageUrl }} style={styles.image} />
                            ) : (
                                /* 🛡️ Fallback elegante si el NAS no tiene la foto */
                                <Ionicons name="person" size={cardWidth * 0.4} color={colors.textMuted} />
                            )}
                        </View>
                        
                        <Text style={styles.name} numberOfLines={2}>
                            {artist.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}