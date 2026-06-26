// src/hooks/useTapToSeek.ts
import { useState, useCallback } from 'react';
import { GestureResponderEvent, LayoutChangeEvent, Vibration } from 'react-native';
import TrackPlayer from 'react-native-track-player';

export const useTapToSeek = (
    position: number,      
    duration: number, 
    isDragging: boolean,
    onOptimisticUpdate: (predictedTime: number) => void
) => {
    const [sliderWidth, setSliderWidth] = useState(0);

    const handleLayout = useCallback((e: LayoutChangeEvent) => {
        setSliderWidth(e.nativeEvent.layout.width);
    }, []);

    // 🎧 ESCUCHA PASIVA: Solo actuamos cuando el usuario levanta el dedo
    const handleTouchEnd = useCallback(async (evt: GestureResponderEvent) => {
        // Si el Slider nativo ya tomó el control (estás arrastrando), lo ignoramos
        if (isDragging || sliderWidth <= 0 || duration <= 0) return;

        const touchX = evt.nativeEvent.locationX;
        const PADDING = 15;
        const usableWidth = sliderWidth - (PADDING * 2);

        // Verificamos dónde estaba la bolita
        const thumbX = PADDING + (position / duration) * usableWidth;
        const distance = Math.abs(touchX - thumbX);

        // Si levantaste el dedo muy cerca de la bolita, fue un roce accidental. No hacemos Tap.
        if (distance < 40) {
            console.log('✋ TAP DESCARTADO: Cerca de la bolita.');
            return; 
        }

        console.log(`⚡ TAP DETECTADO en X: ${touchX.toFixed(2)}. Calculando salto...`);
        const percentage = Math.max(0, Math.min((touchX - PADDING) / usableWidth, 1));
        const seekTime = percentage * duration;

        Vibration.vibrate(15); 
        onOptimisticUpdate(seekTime);
        await TrackPlayer.seekTo(seekTime);

    }, [isDragging, sliderWidth, duration, position, onOptimisticUpdate]);

    return { handleLayout, handleTouchEnd };
};