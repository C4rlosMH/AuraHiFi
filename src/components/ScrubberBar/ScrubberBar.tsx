// src/components/ScrubberBar/ScrubberBar.tsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import { styles } from './ScrubberBar.styles';
import { useTapToSeek } from '../../hooks/useTapToSeek';

export default function ScrubberBar() {
    const { position, duration } = useProgress(250);
    const [dragValue, setDragValue] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const safeDuration = duration > 0 ? duration : 1;
    const displayValue = isDragging ? dragValue : position;

    const handleOptimisticJump = (predictedTime: number) => {
        setIsDragging(true);
        setDragValue(predictedTime); 
        setTimeout(() => setIsDragging(false), 500); 
    };

    const { handleLayout, handleTouchEnd } = useTapToSeek(
        position, safeDuration, isDragging, handleOptimisticJump
    );

    const formatTime = (secs: number) => {
        if (!secs || isNaN(secs) || secs < 0) return '0:00';
        const mins = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        return `${mins}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <View 
            style={styles.progressContainer}
            onLayout={handleLayout}
            onTouchEnd={handleTouchEnd}
        >
            <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={safeDuration}
                value={displayValue}  
                minimumTrackTintColor="#00ffcc"
                maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
                thumbTintColor="#ffffff"
                
                // 🔥 ELIMINAMOS tapToSeek={true} 🔥
                // Ya no lo necesitamos, nuestro hook hace el trabajo pesado y sin bugs.

                onSlidingStart={(val) => {
                    setIsDragging(true);
                    setDragValue(val);
                }}
                onValueChange={(val) => {
                    // Ahora esto fluirá a 60FPS siguiendo tu dedo
                    setDragValue(val); 
                }}
                onSlidingComplete={async (val) => {
                    await TrackPlayer.seekTo(val);
                    setTimeout(() => setIsDragging(false), 200);
                }}
            />
            <View style={styles.timeRow}>
                <Text style={styles.timeText}>{formatTime(displayValue)}</Text>
                <Text style={styles.timeText}>{formatTime(safeDuration)}</Text>
            </View>
        </View>
    );
}