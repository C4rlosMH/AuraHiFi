// src/components/ScrubberBar/ScrubberBar.tsx
import React from 'react';
import { View, Text } from 'react-native';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import { styles } from './ScrubberBar.styles';
import { useTapToSeek } from '../../hooks/useTapToSeek';

export default function ScrubberBar() {
    const { position, duration } = useProgress(250);
    const safeDuration = duration > 0 ? duration : 1;

    const { 
        handleLayout, 
        panHandlers, 
        isDragging, 
        dragValue 
    } = useTapToSeek(safeDuration);

    const displayValue = isDragging ? dragValue : position;
    
    // Regla de 3: ¿En qué porcentaje exacto debe pintarse la bolita? (0 a 100)
    const progressPercent = Math.max(0, Math.min((displayValue / safeDuration) * 100, 100));

    const formatTime = (secs: number) => {
        if (!secs || isNaN(secs) || secs < 0) return '0:00';
        const mins = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        return `${mins}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <View style={styles.progressContainer}>
            
            {/* 🚀 NUESTRO SLIDER CUSTOM CON EL MOTOR GESTUAL */}
            <View 
                style={{ width: '100%', height: 40, justifyContent: 'center' }}
                onLayout={handleLayout}
                {...panHandlers}
            >
                {/* 1. Pista de fondo (Gris transparente) */}
                <View style={{ height: 4, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 2 }} />

                {/* 2. Pista de progreso (Cyan) - Se estira según el porcentaje */}
                <View style={{ 
                    position: 'absolute', 
                    height: 4, 
                    width: `${progressPercent}%`, 
                    backgroundColor: '#00ffcc', 
                    borderRadius: 2,
                    left: 0 
                }} />

                {/* 3. La Bolita (Thumb) - Sigue tu dedo a 60FPS */}
                <View style={{ 
                    position: 'absolute', 
                    left: `${progressPercent}%`, 
                    width: 16, 
                    height: 16, 
                    borderRadius: 8, 
                    backgroundColor: '#ffffff', 
                    marginLeft: -8, // Centra la bolita perfectamente
                    shadowColor: '#00ffcc', // Efecto neón/glow
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 4,
                    elevation: 5 
                }} />
            </View>

            <View style={styles.timeRow}>
                <Text style={styles.timeText}>{formatTime(displayValue)}</Text>
                <Text style={styles.timeText}>{formatTime(safeDuration)}</Text>
            </View>
        </View>
    );
}