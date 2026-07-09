import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface PlayerBackgroundProps {
    artwork?: string;
}

export default function PlayerBackground({ artwork }: PlayerBackgroundProps) {
    if (!artwork) {
        // Fondo de respaldo si no hay canción o no tiene portada
        return <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#0a0a0a' }]} />;
    }

    return (
        <>
            <Image 
                source={{ uri: artwork }}
                style={StyleSheet.absoluteFillObject}
                blurRadius={5}
                resizeMode="cover"
            />
            {/* Capa de contraste ahumada */}
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0, 0, 0, 0.55)' }]} />
        </>
    );
}