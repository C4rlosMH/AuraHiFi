import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './GlobalSearchBar.styles';
import { colors } from '../../../styles/theme';

interface GlobalSearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

export default function GlobalSearchBar({ onSearch, placeholder = "¿Qué quieres escuchar?" }: GlobalSearchBarProps) {
    const [query, setQuery] = useState('');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            onSearch(query);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query, onSearch]);

    const handleClear = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <View style={styles.container}>
            <Ionicons name="search" size={20} color={colors.textMuted} />
            <TextInput 
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={colors.textMuted}
                value={query}
                onChangeText={setQuery}
                autoFocus={false}
            />
            {query.length > 0 && (
                <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                    <Ionicons name="close-circle" size={20} color={colors.textMuted} />
                </TouchableOpacity>
            )}
        </View>
    );
}