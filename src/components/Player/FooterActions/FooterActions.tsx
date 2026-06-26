import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './FooterActions.styles';

interface FooterActionsProps {
    showQueue: boolean;
    onToggleQueue: () => void;
    onOpenLyrics: () => void;
}

export default function FooterActions({ showQueue, onToggleQueue, onOpenLyrics }: FooterActionsProps) {
    return (
        <View style={styles.footerRow}>
            <TouchableOpacity style={styles.footerAction}>
                <MaterialIcons name="podcasts" size={24} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.footerAction} onPress={onOpenLyrics}>
                <MaterialIcons name="lyrics" size={24} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.footerAction} onPress={onToggleQueue}>
                <MaterialIcons name="queue-music" size={24} color={showQueue ? '#00ffcc' : 'rgba(255,255,255,0.8)'} />
            </TouchableOpacity>
        </View>
    );
}