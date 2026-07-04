import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './CollectionActions.styles';
import { colors } from '../../../styles/theme';

interface CollectionActionsProps {
    isLiked: boolean;
    isPinned: boolean;
    isDownloaded: boolean;
    onToggleLike: () => void;
    onTogglePin: () => void;
    onDownload: () => void;
    onPlayAll: () => void;
}

export default function CollectionActions({
    isLiked,
    isPinned,
    isDownloaded,
    onToggleLike,
    onTogglePin,
    onDownload,
    onPlayAll
}: CollectionActionsProps) {
    return (
        <View style={styles.actionRow}>
            <View style={styles.leftActions}>
                {/* LIKE */}
                <TouchableOpacity style={styles.iconButton} onPress={onToggleLike}>
                    <Ionicons 
                        name={isLiked ? "heart" : "heart-outline"} 
                        size={26} 
                        color={isLiked ? colors.light : colors.primary} 
                    />
                </TouchableOpacity>

                {/* PIN */}
                <TouchableOpacity style={styles.iconButton} onPress={onTogglePin}>
                    <Ionicons 
                        name={isPinned ? "pin" : "pin-outline"} 
                        size={26} 
                        color={isPinned ? colors.light : colors.primary} 
                    />
                </TouchableOpacity>

                {/* DOWNLOAD */}
                <TouchableOpacity style={styles.iconButton} onPress={onDownload}>
                    <Ionicons 
                        name={isDownloaded ? "arrow-down-circle" : "arrow-down-circle-outline"} 
                        size={26} 
                        color={isDownloaded ? colors.light : colors.primary} 
                    />
                </TouchableOpacity>
            </View>

            {/* PLAY ALL (Botón gigante flotante) */}
            <TouchableOpacity style={styles.playButton} onPress={onPlayAll}>
                <Ionicons name="play" size={28} color="#000" style={styles.playIconShift} />
            </TouchableOpacity>
        </View>
    );
}