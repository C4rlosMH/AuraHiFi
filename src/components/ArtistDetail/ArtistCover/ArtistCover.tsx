import React from 'react';
import { View, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './ArtistCover.styles';

interface ArtistCoverProps {
    imageUrl?: string;
}

export default function ArtistCover({ imageUrl }: ArtistCoverProps) {
    return (
        <View style={styles.container}>
            {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.image} />
            ) : (
                <View style={styles.fallbackContainer}>
                    <Ionicons name="person" size={80} color="rgba(255,255,255,0.2)" />
                </View>
            )}
        </View>
    );
}