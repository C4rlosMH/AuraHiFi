import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './PlayerHeader.styles';
import { colors } from '../../../styles/theme';


interface PlayerHeaderProps {
    onClose: () => void;
    showLyrics: boolean;
    showQueue: boolean;
    trackTitle?: string;
    trackArtist?: string;
    artwork?: string;
    onOpenOptions?: () => void;
    onCenterPress?: () => void;
}

export const PlayerHeader: React.FC<PlayerHeaderProps> = ({
    onClose,
    showLyrics,
    showQueue,
    trackTitle,
    trackArtist,
    artwork,
    onOpenOptions,
    onCenterPress,
}) => {
    const isContextActive = showLyrics || showQueue;

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={onClose} style={styles.frostedButton}>
                <Ionicons name="chevron-down" size={24} color={colors.primary} />
            </TouchableOpacity>

            {isContextActive && trackTitle ? (
                // CAMBIAMOS ESTE VIEW POR UN TOUCHABLEOPACITY
                <TouchableOpacity 
                    style={styles.metaContextContainer}
                    onPress={onCenterPress}
                    activeOpacity={0.7}
                >
                    {artwork && <Image source={{ uri: artwork }} style={styles.miniArtwork} />}
                    <View style={styles.textContainer}>
                        <Text numberOfLines={1} style={styles.contextTitle}>{trackTitle}</Text>
                        <Text numberOfLines={1} style={styles.contextArtist}>{trackArtist}</Text>
                    </View>
                </TouchableOpacity>
            ) : (
                <View style={styles.emptyCenter} />
            )}

            <TouchableOpacity onPress={onOpenOptions || (() => {})} style={styles.frostedButton}>
                <Ionicons name="ellipsis-horizontal" size={20} color={colors.primary} />
            </TouchableOpacity>
        </View>
    );
};

export default PlayerHeader;