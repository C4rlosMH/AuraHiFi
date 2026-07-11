import React from 'react';
import { Text, TouchableOpacity, Image } from 'react-native';
import { styles } from './ArtistCircleCard.styles';

interface ArtistCircleCardProps {
    artistName: string;
    imageUrl: string;
    onPress: () => void;
}

export default function ArtistCircleCard({ artistName, imageUrl, onPress }: ArtistCircleCardProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <Text style={styles.name} numberOfLines={1}>{artistName}</Text>
        </TouchableOpacity>
    );
}