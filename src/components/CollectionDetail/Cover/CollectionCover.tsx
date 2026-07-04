import React from 'react';
import { View, Image } from 'react-native';
import { styles } from './CollectionCover.styles';

interface CollectionCoverProps {
    coverArtUrl: string;
}

export default function CollectionCover({ coverArtUrl }: CollectionCoverProps) {
    return (
        <View style={styles.container}>
            <Image source={{ uri: coverArtUrl }} style={styles.image} />
        </View>
    );
}