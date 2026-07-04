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
            activeOpacity={0.8}
        >
            <Image source={{ uri: imageUrl }} style={styles.backgroundImage} />
            <View style={styles.overlay}>
                {/* 🛡️ Solo se dibuja el pin si el padre lo autoriza */}
                {showPin && (
                    <Ionicons name="pin" size={16} color={colors.accent} style={styles.pinIcon} />
                )}
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
            </View>
        </TouchableOpacity>
    );
}