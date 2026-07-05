import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './CategoryFilter.styles';
import { colors } from '../../../styles/theme';

interface CategoryFilterProps {
    activeCategory: string | null; // 🚀 Ahora recibe el estado desde el padre
    onSelectCategory: (category: string | null) => void;
}

export default function CategoryFilter({ activeCategory, onSelectCategory }: CategoryFilterProps) {

    const handlePress = (category: string) => {
        // Si tocas la misma categoría que ya está activa, manda 'null' para apagarla
        const newCategory = activeCategory === category ? null : category;
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
                    activeOpacity={0.7}
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
                        activeOpacity={0.7}
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