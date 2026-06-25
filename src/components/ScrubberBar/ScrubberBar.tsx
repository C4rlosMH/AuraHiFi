import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import { styles } from './ScrubberBar.styles';

export default function ScrubberBar() {
    const { position, duration } = useProgress();
    const [isSeeking, setIsSeeking] = useState(false);
    const [seekPosition, setSeekPosition] = useState(0);

    // 1. Blindaje matemático contra valores nulos o desfasados del motor
    const safeDuration = duration && !isNaN(duration) && duration > 0 ? duration : 1;
    let safePosition = isSeeking ? seekPosition : position;
    
    // Evitar que la posición sea menor a 0 o mayor a la duración (causa principal de crashes nativos)
    if (isNaN(safePosition) || safePosition < 0) {
        safePosition = 0;
    }
    if (safePosition > safeDuration) {
        safePosition = safeDuration;
    }

    useEffect(() => {
        if (!isSeeking) {
            setSeekPosition(safePosition);
        }
    }, [position, isSeeking]);

    const formatTime = (secs: number) => {
        if (!secs || isNaN(secs) || secs < 0) return '0:00';
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <View style={styles.progressContainer}>
            <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={safeDuration}
                value={safePosition}
                minimumTrackTintColor="#ffffff"
                maximumTrackTintColor="rgba(255, 255, 255, 0.15)"
                thumbTintColor="#ffffff"
                onSlidingStart={() => setIsSeeking(true)}
                onValueChange={(value) => setSeekPosition(value)}
                onSlidingComplete={async (value) => {
                    try {
                        await TrackPlayer.seekTo(value);
                    } catch (error) {
                        console.error("Error en el salto de pista:", error);
                    } finally {
                        setIsSeeking(false);
                    }
                }}
            />
            <View style={styles.timeRow}>
                <Text style={styles.timeText}>{formatTime(safePosition)}</Text>
                <Text style={styles.timeText}>{formatTime(safeDuration)}</Text>
            </View>
        </View>
    );
}