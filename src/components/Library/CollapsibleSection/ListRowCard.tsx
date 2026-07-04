import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { styles } from './ListRowCard.styles';

// Adaptado a los props que ya tienes en tu proyecto
interface ListRowCardProps {
    id?: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    onPress: () => void;
}

export default function ListRowCard({ title, subtitle, imageUrl, onPress }: ListRowCardProps) {
    return (
        <TouchableOpacity 
            style={styles.cardContainer} 
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: imageUrl }} style={styles.image} />
            </View>
            
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
            </View>
        </TouchableOpacity>
    );
}