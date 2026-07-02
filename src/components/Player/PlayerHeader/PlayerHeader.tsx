import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './PlayerHeader.styles';

interface PlayerHeaderProps {
    onClose: () => void;
    showLyrics: boolean;
    showQueue: boolean;
    trackTitle?: string;
    trackArtist?: string;
    artwork?: string;
    onOpenOptions?: () => void;
}

export const PlayerHeader: React.FC<PlayerHeaderProps> = ({
    onClose,
    showLyrics,
    showQueue,
    trackTitle,
    trackArtist,
    artwork,
    onOpenOptions
}) => {
    const isContextActive = showLyrics || showQueue;

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={onClose} style={styles.frostedButton}>
                <Ionicons name="chevron-down" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            {isContextActive && trackTitle ? (
                <View style={styles.metaContextContainer}>
                    {artwork && <Image source={{ uri: artwork }} style={styles.miniArtwork} />}
                    <View style={styles.textContainer}>
                        <Text numberOfLines={1} style={styles.contextTitle}>{trackTitle}</Text>
                        <Text numberOfLines={1} style={styles.contextArtist}>{trackArtist}</Text>
                    </View>
                </View>
            ) : (
                <View style={styles.emptyCenter} />
            )}

            <TouchableOpacity onPress={onOpenOptions || (() => {})} style={styles.frostedButton}>
                <Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
};

export default PlayerHeader;