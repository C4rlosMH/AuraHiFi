import React, { useContext } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SocketContext } from '../../../context/SocketContext';

import { styles } from './FooterActions.styles';
import { colors } from '../../../styles/theme';

interface FooterActionsProps {
    showQueue: boolean;
    showLyrics: boolean;
    onToggleQueue: () => void;
    onOpenLyrics: () => void;
    onOpenTune: () => void;
}

export default function FooterActions({ showQueue, showLyrics, onToggleQueue, onOpenLyrics, onOpenTune }: FooterActionsProps) {
    const { isAnyTuneActive } = useContext(SocketContext);
    return (
        <View style={styles.footerRow}>
            <TouchableOpacity style={styles.footerAction} onPress={onOpenTune}>
                <View>
                    <MaterialIcons 
                        name="podcasts" 
                        size={24} 
                        // Si hay un Tune, el ícono se ilumina un poco más
                        color={isAnyTuneActive ? colors.light : colors.textMuted} 
                    />
                    {/* 🚀 NUEVO: Renderizamos el punto cyan solo si alguien está transmitiendo */}
                    {isAnyTuneActive && <View style={styles.activeTuneBadge} />}
                </View>
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