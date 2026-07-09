// src/components/ScrubberBar/ScrubberBar.tsx
import React from 'react';
import { View, Text } from 'react-native';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import { styles } from './ScrubberBar.styles';
import { useTapToSeek } from '../../../hooks/useTapToSeek';

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
            <View 
                style={styles.sliderTrackContainer}
                onLayout={handleLayout}
                {...panHandlers}
            >
                <View style={styles.trackBackground} />
                <View style={[styles.trackProgress, { width: `${progressPercent}%` }]} />
                <View style={[styles.thumb, { left: `${progressPercent}%` }]} />
            </View>

            <View style={styles.timeRow}>
                <Text style={styles.timeText}>{formatTime(displayValue)}</Text>
                <Text style={styles.timeText}>{formatTime(safeDuration)}</Text>
            </View>
        </View>
    );
}