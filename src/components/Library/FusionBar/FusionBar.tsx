import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { styles } from './FusionBar.styles';
import { colors } from '../../../styles/theme';

interface FusionBarProps {
    isProcessing: boolean;
    onUnion: () => void;
    onIntersection: () => void;
    onDifference: () => void;
}

export default function FusionBar({ isProcessing, onUnion, onIntersection, onDifference }: FusionBarProps) {
    if (isProcessing) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.fusionBtn} onPress={onUnion}>
                <Text style={styles.btnIcon}>∪</Text>
                <Text style={styles.btnText}>Unir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fusionBtn} onPress={onIntersection}>
                <Text style={styles.btnIcon}>∩</Text>
                <Text style={styles.btnText}>Cruzar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fusionBtn} onPress={onDifference}>
                <Text style={styles.btnIcon}>−</Text>
                <Text style={styles.btnText}>Restar</Text>
            </TouchableOpacity>
        </View>
    );
}