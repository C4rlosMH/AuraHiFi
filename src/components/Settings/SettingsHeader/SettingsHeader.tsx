import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './SettingsHeader.styles';
import { colors } from '../../../styles/theme';

interface SettingsHeaderProps {
    title: string;
    onBack: () => void;
}

export default function SettingsHeader({ title, onBack }: SettingsHeaderProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
                <Ionicons name="chevron-back" size={24} color={colors.primary} style={styles.iconBackShift} />
            </TouchableOpacity>
            
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
            </View>
            
            <View style={styles.rightSpacer} />
        </View>
    );
}