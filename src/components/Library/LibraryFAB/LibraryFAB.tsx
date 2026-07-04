import React, { useState, useEffect } from 'react';
import { TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import TrackPlayer, { Event, useTrackPlayerEvents } from 'react-native-track-player';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { styles } from './LibraryFAB.styles';
import { colors } from '../../../styles/theme'; // 🚀 Uso exclusivo de colores globales

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface LibraryFABProps {
    onPress: () => void;
}

export default function LibraryFAB({ onPress }: LibraryFABProps) {
    const [isMiniPlayerVisible, setIsMiniPlayerVisible] = useState(false);

    // 1. Verificación dura y real al montar el componente
    const checkActualPlayerState = async () => {
        try {
            // Si la cola está vacía, es imposible que el MiniPlayer esté renderizado
            const queue = await TrackPlayer.getQueue();
            setIsMiniPlayerVisible(queue.length > 0);
        } catch (error) {
            setIsMiniPlayerVisible(false);
        }
    };

    useEffect(() => {
        checkActualPlayerState();
    }, []);

    // 2. Escuchamos eventos estrictos del motor nativo
    useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.PlaybackQueueEnded], async (event) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        
        if (event.type === Event.PlaybackQueueEnded) {
            // Si la música se acaba y la cola se vacía, el botón baja.
            setIsMiniPlayerVisible(false);
        } else if (event.type === Event.PlaybackTrackChanged) {
            // Si hay un salto de pista válido, el botón sube/se mantiene arriba.
            setIsMiniPlayerVisible(event.nextTrack != null);
        }
    });

    // 📏 Matemáticas exactas de UI:
    // Si NO hay MiniPlayer -> bottom: 85 (Flota justo encima de la Navbar de 65px)
    // Si SÍ hay MiniPlayer -> bottom: 150 (Flota encima del MiniPlayer)
    const dynamicBottom = isMiniPlayerVisible ? 150 : 85;

    return (
        <TouchableOpacity 
            style={[styles.fab, { bottom: dynamicBottom }]} 
            onPress={onPress} 
            activeOpacity={0.8}
        >
            <Ionicons name="add" size={32} color={colors.accent} />
        </TouchableOpacity>
    );
}