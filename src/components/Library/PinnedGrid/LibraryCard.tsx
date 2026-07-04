import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { styles } from './LibraryCard.styles';
import { colors } from '../../../styles/theme';

interface LibraryCardProps {
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    onPress: () => void;
    showPin?: boolean; // 🚀 CONTROLADOR DE PIN INYECTADO
}

export default function LibraryCard({ title, subtitle, imageUrl, onPress, showPin = false }: LibraryCardProps) {
    return (
        <TouchableOpacity 
            style={styles.cardContainer} 
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* 1. EL COVER ART (Imagen cuadrada perfecta con su borde) */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: imageUrl }} style={styles.image} />
                
                {/* 🛡️ El pin ahora es una medalla (badge) flotante en la esquina */}
                {showPin && (
                    <View style={styles.pinBadge}>
                        <Ionicons name="pin" size={12} color={colors.background} />
                    </View>
                )}
            </View>
            
            {/* 2. LA METADATA LIMPIA DEBAJO (Como Apple Music) */}
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
            </View>
        </TouchableOpacity>
    );
}