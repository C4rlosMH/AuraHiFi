import React from 'react';
import { View, Text } from 'react-native';
import LibraryCard from '../PinnedGrid/LibraryCard'; // Reutilizamos tu tarjeta con las matemáticas perfectas
import { styles } from './CollectionGrid.styles';

interface CollectionGridProps {
    title?: string;
    data: any[];
    onItemPress: (id: string, title: string) => void;
}

export default function CollectionGrid({ title = "Tu Colección", data, onItemPress }: CollectionGridProps) {
    if (!data || data.length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.grid}>
                {data.map((item) => (
                    <LibraryCard
                        key={`collection-${item.id}`}
                        id={item.id}
                        title={item.title}
                        subtitle={item.artist || 'Álbum'} 
                        imageUrl={item.coverArtUrl}
                        onPress={() => onItemPress(item.id, item.title)}
                        showPin={false} // 🚀 CLAVE UX: No dibuja el icono del pin en la colección
                    />
                ))}
            </View>
        </View>
    );
}