// src/components/Library/LibraryHeader/LibraryHeader.tsx

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { styles } from './LibraryHeader.styles';
import { colors } from '../../../styles/theme';
import LocalSearchBar from '../../Common/LocalSearchBar/LocalSearchBar';

interface LibraryHeaderProps {
    searchQuery: string;
    onSearchChange: (text: string) => void;
    isSearchVisible: boolean;
    setIsSearchVisible: (visible: boolean) => void;
    activeCategory: string | null;
}

export default function LibraryHeader({
    searchQuery,
    onSearchChange,
    isSearchVisible,
    setIsSearchVisible,
    activeCategory
}: LibraryHeaderProps) {
    return (
        <View style={styles.container}>
            {isSearchVisible ? (
                <View style={styles.searchWrapper}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <LocalSearchBar 
                            searchQuery={searchQuery}
                            onSearchChange={onSearchChange}
                            placeholder={`Buscar en ${activeCategory || 'Biblioteca'}...`}
                            variant='header'
                        />
                    </View>
                    <TouchableOpacity 
                        style={styles.iconButton} 
                        onPress={() => {
                            setIsSearchVisible(false);
                            onSearchChange(''); // Limpia al cerrar
                        }}
                    >
                        <Ionicons name="close" size={20} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <Text style={styles.title}>Biblioteca</Text>
                    <TouchableOpacity 
                        style={styles.iconButton} 
                        onPress={() => setIsSearchVisible(true)}
                    >
                        <Ionicons name="search" size={20} color={colors.primary} />
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}