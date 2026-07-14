import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './ArtistActions.styles';
import { colors } from '../../../styles/theme';

interface ArtistActionsProps {
    isFollowing: boolean;
    onToggleFollow: () => void;
    onPlayAll: () => void;
    onShuffle: () => void;
}

export default function ArtistActions({ isFollowing, onToggleFollow, onPlayAll, onShuffle }: ArtistActionsProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.iconButton} onPress={onToggleFollow} activeOpacity={0.7}>
                <Ionicons 
                    name={isFollowing ? "person" : "person-add-outline"} 
                    size={24} 
                    color={isFollowing ? colors.light : colors.primary} 
                />
            </TouchableOpacity>
            {/* Primero Shuffle, luego Play (Patrón estético de iOS) */}
            <TouchableOpacity style={styles.iconButton} onPress={onShuffle} activeOpacity={0.7}>
                <Ionicons name="shuffle" size={20} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.playButton} onPress={onPlayAll} activeOpacity={0.8}>
                <Ionicons name="play" size={22} style={styles.playBtnText} />
            </TouchableOpacity>
        </View>
    );
}