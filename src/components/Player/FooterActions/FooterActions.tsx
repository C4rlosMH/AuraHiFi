import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

import { styles } from './FooterActions.styles';
import { colors } from '../../../styles/theme';

interface FooterActionsProps {
    showQueue: boolean;
    showLyrics: boolean;
    onToggleQueue: () => void;
    onOpenLyrics: () => void;
}

export default function FooterActions({ showQueue, showLyrics, onToggleQueue, onOpenLyrics }: FooterActionsProps) {
    return (
        <View style={styles.footerRow}>
            <TouchableOpacity style={styles.footerAction}>
                <MaterialIcons name="podcasts" size={24} color={colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.footerAction} onPress={onOpenLyrics}>
                <MaterialIcons name="lyrics" size={24} color={showLyrics ? colors.light : colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.footerAction} onPress={onToggleQueue}>
                <MaterialIcons name="queue-music" size={24} color={showQueue ? colors.light : colors.textMuted} />
                {/* <Ionicons name="albums-outline" size={24} color={showQueue ? colors.light : colors.textMuted} /> */}
                {/* <Ionicons name="list-outline" size={24} color={showQueue ? colors.light : colors.textMuted} /> */}
            </TouchableOpacity>
        </View>
    );
}