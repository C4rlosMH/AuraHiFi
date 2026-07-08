// src/components/Library/CollectionGrid/CollectionGrid.tsx

import React from 'react';
import { View, Text } from 'react-native';
import LibraryCard from '../PinnedGrid/LibraryCard'; 
import { styles } from './CollectionGrid.styles';

interface CollectionGridProps {
    title?: string;
    data: any[];
    onItemPress: (id: string, title: string, type: any) => void;
    onItemLongPress?: (id: string, type: string) => void;
    isSelectMode?: boolean;
    selectedIds?: string[];
}

export default function CollectionGrid({ 
    title = "Tu Colección", 
    data, 
    onItemPress,
    onItemLongPress,
    isSelectMode = false,
    selectedIds = []
}: CollectionGridProps) {
    if (!data || data.length === 0) return null;

    return (
        <View style={styles.container}>
            {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
            <View style={styles.grid}>
                {data.map((item, index) => {
                    const displayImage = item.imageUrl || item.coverArtUrl || item.artistImageUrl;
                    const displaySubtitle = item.subtitle || item.artist || item.year || `${item.albumCount || 0} discos`;
                    const displayTitle = item.title || item.name;
                    const itemType = item.type || 'album';

                    const isSelected = isSelectMode && selectedIds.includes(item.id);

                    return (
                        <LibraryCard
                            key={`collection-${itemType}-${item.id || index}`}
                            id={item.id}
                            title={displayTitle}
                            subtitle={displaySubtitle} 
                            imageUrl={displayImage}
                            type={itemType}
                            iconName={item.iconName}
                            onPress={() => onItemPress(item.id, displayTitle, itemType)}
                            showPin={false} 
                            onLongPress={() => onItemLongPress?.(item.id, itemType)}
                            isSelectMode={isSelectMode}
                            isSelected={isSelected}
                        />
                    );
                })}
            </View>
        </View>
    );
}