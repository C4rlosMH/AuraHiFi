import React from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from './ActivityFab.styles';
import { colors } from '../../../styles/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
            <MaterialCommunityIcons name="account-group" size={28} color={colors.light} />
        </TouchableOpacity>
    );
}