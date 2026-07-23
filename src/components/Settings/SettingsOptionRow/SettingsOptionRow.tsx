import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './SettingsOptionRow.styles';
import { colors } from '../../../styles/theme';

interface SettingsOptionRowProps {
    title: string;
    subtitle?: string;
    iconName: string;
    onPress: () => void;
}

export default function SettingsOptionRow({ title, subtitle, iconName, onPress }: SettingsOptionRowProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.iconContainer}>
                <Ionicons name={iconName} size={26} color={colors.primary} />
            </View>
            
            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                {subtitle && (
                    <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>
                )}
            </View>
            
            <Ionicons name="chevron-forward" size={20} style={styles.rightIcon} />
        </TouchableOpacity>
    );
}