import React from 'react';
import { Text, TouchableOpacity, Image } from 'react-native';
import { styles } from './FeaturedAlbumCard.styles';

interface FeaturedAlbumCardProps {
    title: string;
    highlightText: string;
    imageUrl: string;
    onPress: () => void;
}

export default function FeaturedAlbumCard({ title, highlightText, imageUrl, onPress }: FeaturedAlbumCardProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <Text style={styles.highlight} numberOfLines={1}>{highlightText}</Text>
        </TouchableOpacity>
    );
}