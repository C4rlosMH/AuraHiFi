import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { colors } from '../../../styles/theme';
import { styles } from './LocalSearchBar.styles';

interface LocalSearchBarProps {
    searchQuery: string;
    onSearchChange: (text: string) => void;
    placeholder?: string;
    variant?: 'default' | 'header'
}

export default function LocalSearchBar({ 
    searchQuery, 
    onSearchChange, 
    placeholder = "Buscar en la lista...",
    variant = 'default'
}: LocalSearchBarProps) {
    return (
        <View style={[styles.container, variant === 'header' && styles.headerVariant]}>
            
            <Ionicons name="search" size={20} style={styles.searchIcon} />
            
            <TextInput
                style={[styles.input, variant === 'header' && styles.headerInput]}
                value={searchQuery}
                onChangeText={onSearchChange}
                placeholder={placeholder}
                placeholderTextColor={colors.textMuted}
                autoCorrect={false}
                autoCapitalize="none"
                cursorColor={colors.accent} 
            />
            
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