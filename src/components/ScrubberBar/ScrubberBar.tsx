import React from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import { styles } from './ScrubberBar.styles';

export default function ScrubberBar() {
    // El re-renderizado por segundo ahora está atrapado solo en este componente
    const { position, duration } = useProgress();

    const formatTime = (secs: number) => {
        if (!secs || isNaN(secs)) return '0:00';
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <View style={styles.progressContainer}>
            <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={duration || 1}
                value={position}
                minimumTrackTintColor="#ffffff"
                maximumTrackTintColor="rgba(255, 255, 255, 0.15)"
                thumbTintColor="#ffffff"
                onSlidingComplete={async (value) => {
                    await TrackPlayer.seekTo(value);
                }}
            />
            <View style={styles.timeRow}>
                <Text style={styles.timeText}>{formatTime(position)}</Text>
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
        </View>
    );
}