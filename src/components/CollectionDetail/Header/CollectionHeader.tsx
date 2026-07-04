import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './CollectionHeader.styles';

interface CollectionHeaderProps {
    onBack: () => void;
    onOptions?: () => void;
}

export default function CollectionHeader({ onBack, onOptions }: CollectionHeaderProps) {
    return (
        <View style={styles.headerContainer}>
            {/* Botón de Regreso con capa Aura Frosted */}
            <TouchableOpacity style={styles.iconButton} onPress={onBack}>
                <Ionicons name="chevron-back" size={24} color="#ffffff" style={styles.iconBackShift} />
            </TouchableOpacity>
            
            {/* Botón de Opciones con capa Aura Frosted */}
            <TouchableOpacity style={styles.iconButton} onPress={onOptions}>
                <Ionicons name="ellipsis-vertical" size={22} color="#ffffff" />
            </TouchableOpacity>
        </View>
    );
}