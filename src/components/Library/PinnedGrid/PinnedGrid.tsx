import React from 'react';
import { View, Text } from 'react-native';
import LibraryCard from './LibraryCard';
import { styles } from './PinnedGrid.styles';

interface PinnedGridProps {
    title?: string;
    data: any[];
    onItemPress: (id: string, title: string) => void;
    isPinnedSection?: boolean; // 🚀 CONTROLADOR DE COMPORTAMIENTO GLOBAL
}

export default function PinnedGrid({ title = "Pins", data, onItemPress, isPinnedSection = true }: PinnedGridProps) {
    if (!data || data.length === 0) return null;

    const pinnedData = data.slice(0, 6);

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.grid}>
                {pinnedData.map((item) => (
                    <LibraryCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        subtitle={item.artist} 
                        imageUrl={item.coverArtUrl}
                        onPress={() => onItemPress(item.id, item.title)}
                        showPin={isPinnedSection} // 🚀 Pasa el comportamiento a la tarjeta
                    />
                ))}
            </View>
        </View>
    );
}