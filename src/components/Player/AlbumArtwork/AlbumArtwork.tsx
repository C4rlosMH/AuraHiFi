import React from 'react';
import { View, Image } from 'react-native';
import { styles } from './AlbumArtwork.styles';

interface AlbumArtworkProps {
    artwork?: string;
}

export default function AlbumArtwork({ artwork }: AlbumArtworkProps) {
    return (
        <View style={styles.artworkContainer}>
            <Image 
                // Ajusta la ruta del icon.png si tienes tu imagen por defecto en otro lado
                source={artwork ? { uri: artwork } : require('../../../../assets/icon.png')} 
                style={styles.albumArtwork}
                resizeMode="cover"
            />
        </View>
    );
}