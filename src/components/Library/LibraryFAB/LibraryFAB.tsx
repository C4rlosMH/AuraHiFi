import React, { useState, useEffect } from 'react';
import { TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import TrackPlayer, { Event, useTrackPlayerEvents } from 'react-native-track-player';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { styles } from './LibraryFAB.styles';
import { colors } from '../../../styles/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// 🚀 1. Limpiamos la interfaz para que solo exija el onPress
interface LibraryFABProps {
    onPress: () => void;
}

export default function LibraryFAB({ onPress }: LibraryFABProps) {
    const [isMiniPlayerVisible, setIsMiniPlayerVisible] = useState(false);

    const checkActualPlayerState = async () => {
        try {
            const queue = await TrackPlayer.getQueue();
            setIsMiniPlayerVisible(queue.length > 0);
        } catch (error) {
            setIsMiniPlayerVisible(false);
        }
    };

    useEffect(() => {
        checkActualPlayerState();
    }, []);

    useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.PlaybackQueueEnded], async (event) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        
        if (event.type === Event.PlaybackQueueEnded) {
            setIsMiniPlayerVisible(false);
        } else if (event.type === Event.PlaybackTrackChanged) {
            setIsMiniPlayerVisible(event.nextTrack != null);
        }
    });

    const dynamicBottom = isMiniPlayerVisible ? 150 : 85;

    // 🚀 2. Adiós a la lógica híbrida camaleónica. Ahora es un botón directo y predecible.
    return (
        <TouchableOpacity 
            style={[styles.fab, { bottom: dynamicBottom }]} 
            onPress={onPress} 
            activeOpacity={0.8}
        >
            {/* Usamos el ícono de 'add' o puedes cambiarlo por 'ellipsis-horizontal' si prefieres */}
            <Ionicons name="add" size={28} color={colors.primary} />
        </TouchableOpacity>
    );
}