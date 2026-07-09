import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

interface PlayerBackgroundProps {
    artwork?: string;
}

export default function PlayerBackground({ artwork }: PlayerBackgroundProps) {
    if (!artwork) {
        // Fondo de respaldo si no hay canción o no tiene portada
        return <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.background }]} />;
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
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.glassBadge }]} />
        </>
    );
}