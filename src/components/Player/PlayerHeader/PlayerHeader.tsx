import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './PlayerHeader.styles';

interface PlayerHeaderProps {
    title: string;
    onClose: () => void;
}

export default function PlayerHeader({ title, onClose }: PlayerHeaderProps) {
    return (
        <View style={styles.headerRow}>
            <TouchableOpacity onPress={onClose}>
                <View style={styles.glassCircle}>
                    <MaterialIcons name="keyboard-arrow-down" size={30} color="#ffffff" />
                </View>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
            {/* Espacio vacío de 48px para centrar el título matemáticamente */}
            <View style={{ width: 48 }} /> 
        </View>
    );
}