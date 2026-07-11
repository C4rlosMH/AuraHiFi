import React from 'react';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './ActivityFab.styles';

interface ActivityFabProps {
    onPress: () => void;
}

export default function ActivityFab({ onPress }: ActivityFabProps) {
    return (
        <TouchableOpacity 
            style={styles.button} 
            onPress={onPress} 
            activeOpacity={0.8}
        >
            <Ionicons name="pulse" size={28} color={styles.iconColor.color} />
        </TouchableOpacity>
    );
}