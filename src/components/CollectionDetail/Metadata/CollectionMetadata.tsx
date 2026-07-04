import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './CollectionMetadata.styles';

interface CollectionMetadataProps {
    title: string;
    subtitle: string;
}

export default function CollectionMetadata({ title, subtitle }: CollectionMetadataProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title} numberOfLines={2}>{title}</Text>
            <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        </View>
    );
}