import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { styles } from './TopMixCard.styles';

interface TopMixCardProps {
    title: string;
    subtitle: string;
    imageUrl: string;
    onPress: () => void;
}

export default function TopMixCard({ title, subtitle, imageUrl, onPress }: TopMixCardProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                {/* <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> */}
            </View>
        </TouchableOpacity>
    );
}