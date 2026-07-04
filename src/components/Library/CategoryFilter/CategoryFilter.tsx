import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './CategoryFilter.styles';
import { colors } from '../../../styles/theme';

interface CategoryFilterProps {
    onSelectCategory: (category: string | null) => void;
}

export default function CategoryFilter({ onSelectCategory }: CategoryFilterProps) {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const handlePress = (category: string) => {
        // Si tocas la misma categoría que ya está activa, la desmarca (vuelve a la vista general)
        const newCategory = activeCategory === category ? null : category;
        setActiveCategory(newCategory);
        onSelectCategory(newCategory);
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* 🚀 EL CAJÓN MAESTRO: Canciones Guardadas (Caché Offline) */}
                <TouchableOpacity 
                    style={[styles.chip, activeCategory === 'guardados' && styles.chipActive]} 
                    onPress={() => handlePress('guardados')}
                >
                    <Ionicons 
                        name="cloud-download-outline" 
                        size={18} 
                        color={activeCategory === 'guardados' ? colors.accent : colors.primary} 
                        style={styles.icon}
                    />
                    <Text style={[styles.chipText, activeCategory === 'guardados' && styles.chipTextActive]}>
                        Guardados
                    </Text>
                </TouchableOpacity>

                {/* Filtros Nativos de la Biblioteca */}
                {['Playlists', 'Álbumes', 'Artistas'].map((cat) => (
                    <TouchableOpacity 
                        key={cat}
                        style={[styles.chip, activeCategory === cat && styles.chipActive]} 
                        onPress={() => handlePress(cat)}
                    >
                        <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}