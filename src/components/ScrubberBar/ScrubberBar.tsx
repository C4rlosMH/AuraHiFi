import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import { styles } from './ScrubberBar.styles';

export default function ScrubberBar() {
    const { position, duration } = useProgress(250);
    const [dragValue, setDragValue] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const safeDuration = duration > 0 ? duration : 1;
    // Si estás arrastrando, mostramos tu dedo. Si no, mostramos la música.
    const displayValue = isDragging ? dragValue : position;

    const formatTime = (secs: number) => {
        if (!secs || isNaN(secs) || secs < 0) return '0:00';
        const mins = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        return `${mins}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <View style={styles.progressContainer}>
            <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={safeDuration}
                value={displayValue}
                minimumTrackTintColor="#00ffcc"
                maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
                thumbTintColor="#ffffff"
                onSlidingStart={(val) => {
                    setIsDragging(true);
                    setDragValue(val);
                }}
                onValueChange={(val) => setDragValue(val)}
                onSlidingComplete={async (val) => {
                    await TrackPlayer.seekTo(val);
                    setTimeout(() => setIsDragging(false), 200); // Suaviza la transición
                }}
            />
            <View style={styles.timeRow}>
                <Text style={styles.timeText}>{formatTime(displayValue)}</Text>
                <Text style={styles.timeText}>{formatTime(safeDuration)}</Text>
            </View>
        </View>
    );
}