import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import { styles } from './TrackMetadata.styles';
import { colors } from '../../../styles/theme';

interface TrackMetadataProps {
    title: string;
    artist: string;
    isFavorite: boolean;
    onToggleFavorite: () => void;
}

export default function TrackMetadata({ title, artist, isFavorite, onToggleFavorite }: TrackMetadataProps) {
    return (
        <View style={styles.metaRow}>
            <View style={styles.textMetadataColumn}>
                <Text style={styles.titleText} numberOfLines={1}>
                    {title}
                </Text>
                <Text style={styles.artistText} numberOfLines={1}>
                    {artist}
                </Text>
            </View>
            <TouchableOpacity onPress={onToggleFavorite}>
                {/* <MaterialIcons 
                    name={isFavorite ? "favorite" : "favorite-border"} 
                    size={28} 
                    color={isFavorite ? colors.light : colors.primary} 
                /> */}
                <Octicons 
                    name={isFavorite ? "heart-fill" : "heart"} 
                    size={28} 
                    color={isFavorite ? colors.light : colors.primary} 
                />
            </TouchableOpacity>
        </View>
    );
}