import React from 'react';
import { Text, TouchableOpacity, Image } from 'react-native';
import { styles } from './SquareAlbumCard.styles';

interface SquareAlbumCardProps {
    title: string;
    subtitle: string;
    imageUrl: string;
    onPress: () => void;
}

export default function SquareAlbumCard({ title, subtitle, imageUrl, onPress }: SquareAlbumCardProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        </TouchableOpacity>
    );
}