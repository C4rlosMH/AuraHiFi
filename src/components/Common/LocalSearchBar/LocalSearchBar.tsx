import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { colors } from '../../../styles/theme';
import { styles } from './LocalSearchBar.styles';

interface LocalSearchBarProps {
    searchQuery: string;
    onSearchChange: (text: string) => void;
    placeholder?: string;
}

export default function LocalSearchBar({ 
    searchQuery, 
    onSearchChange, 
    placeholder = "Buscar en la lista..." 
}: LocalSearchBarProps) {
    return (
        <View style={styles.container}>
            {/* Ícono de lupa */}
            <Ionicons name="search" size={20} style={styles.searchIcon} />
            
            {/* Campo de texto responsivo */}
            <TextInput
                style={styles.input}
                value={searchQuery}
                onChangeText={onSearchChange}
                placeholder={placeholder}
                placeholderTextColor={colors.textMuted}
                autoCorrect={false}
                autoCapitalize="none"
                cursorColor={colors.accent} // 🚀 El cursor de escritura usará tu color cian
            />
            
            {/* Botón de borrado rápido (Solo visible si hay texto) */}
            {searchQuery.length > 0 && (
                <TouchableOpacity 
                    style={styles.clearButton} 
                    onPress={() => onSearchChange('')}
                >
                    <Ionicons name="close-circle" size={20} style={styles.clearIcon} />
                </TouchableOpacity>
            )}
        </View>
    );
}