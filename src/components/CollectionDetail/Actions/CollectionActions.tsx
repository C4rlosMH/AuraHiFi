import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './CollectionActions.styles';
import { colors } from '../../../styles/theme';

interface CollectionActionsProps {
    isLiked: boolean;
    isPinned: boolean;
    isDownloaded: boolean;
    downloadProgress?: string | null;
    isPlaylist?: boolean;
    onAddSongs?: () => void;
    onToggleLike: () => void;
    onTogglePin: () => void;
    onDownload: () => void;
    onPlayAll: () => void;
    onShufflePlay: () => void;
}

export default function CollectionActions({
    isLiked,
    isPinned,
    isDownloaded,
    downloadProgress,
    isPlaylist = false,
    onAddSongs,
    onToggleLike,
    onTogglePin,
    onDownload,
    onPlayAll,
    onShufflePlay,

}: CollectionActionsProps) {
    return (
        <View style={styles.actionRow}>
            <View style={styles.leftActions}>
                {/* AÑADIR */}
                {isPlaylist && onAddSongs && (
                    <TouchableOpacity style={styles.iconButton} onPress={onAddSongs}>
                        <Ionicons name="add-circle-outline" size={26} color={colors.primary} />
                    </TouchableOpacity>
                )}
                
                

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
                <TouchableOpacity style={styles.iconButton} onPress={onDownload} disabled={downloadProgress !== null}>
                    {downloadProgress ? (
                        <Text style={styles.progressText}>{downloadProgress}</Text>
                    ) : (
                        <Ionicons 
                            name={isDownloaded ? "arrow-down-circle" : "arrow-down-circle-outline"} 
                            size={26} 
                            color={isDownloaded ? colors.light : colors.primary} 
                        />
                    )}
                </TouchableOpacity>
            </View>

            {/* SHUFFLE */}
                <TouchableOpacity style={styles.iconButton} onPress={onShufflePlay}>
                    <Ionicons name="shuffle" size={26} color={colors.primary} />
                </TouchableOpacity>

            {/* PLAY ALL (Botón gigante flotante) */}
            <TouchableOpacity style={styles.playButton} onPress={onPlayAll}>
                <Ionicons name="play" size={28} color="#000" style={styles.playIconShift} />
            </TouchableOpacity>
        </View>
    );
}