import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { styles } from './ExploreGrid.styles';
import { gradients } from '../../../styles/theme';

export interface ExploreCategory {
    id: string;
    title: string;
    color: string;
}

// Aprovechamos los tonos base oscuros de tus gradientes para las tarjetas
const EXPLORE_CATEGORIES: ExploreCategory[] = [
    { id: '1', title: 'Creado para ti', color: gradients.cyberPink[0] },
    { id: '2', title: 'Novedades', color: gradients.indigoOceano[0] },
    { id: '3', title: 'Pop', color: gradients.volcanico[0] },
    { id: '4', title: 'Electrónica', color: gradients.aurora[0] },
    { id: '5', title: 'Audio Hi-Res', color: gradients.rubiOscuro[0] },
    { id: '6', title: 'Descargas Locales', color: gradients.sangreDeDragon[0] },
    { id: '7', title: 'Favoritos', color: gradients.orquideaCosmica[0] },
    { id: '8', title: 'Dance', color: gradients.eclipseMarcial[0] },
];

interface ExploreGridProps {
    onCategoryPress: (category: ExploreCategory) => void;
}

export default function ExploreGrid({ onCategoryPress }: ExploreGridProps) {
    const renderItem = ({ item }: { item: ExploreCategory }) => (
        <TouchableOpacity 
            style={[styles.card, { backgroundColor: item.color }]} 
            activeOpacity={0.8}
            onPress={() => onCategoryPress(item)}
        >
            <Text style={styles.cardTitle}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Explorar todo</Text>
            <FlatList
                data={EXPLORE_CATEGORIES}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}