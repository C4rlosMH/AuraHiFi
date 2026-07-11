import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TrackPlayer, { RepeatMode } from 'react-native-track-player';
import { styles } from './ReproductionControls.styles';
import { colors } from '../../../styles/theme';

interface ReproductionControlsProps {
    isPlaying: boolean;
    shuffleOn: boolean;
    onToggleShuffle: () => void;
    repeatState: RepeatMode;
    onCycleRepeat: () => void;
}

const ACTIVE_REPEAT_COLOR = colors.light;

export default function ReproductionControls({
    isPlaying, shuffleOn, onToggleShuffle, repeatState, onCycleRepeat
}: ReproductionControlsProps) {

    const isRepeatActive = repeatState === RepeatMode.Queue || repeatState === RepeatMode.Track;
    const isRepeatOne = repeatState === RepeatMode.Track;
    const repeatColor = isRepeatActive ? ACTIVE_REPEAT_COLOR : colors.textMuted;

    return (
        <View style={styles.controlsRow}>
            <TouchableOpacity onPress={onToggleShuffle}>
                <Ionicons name="shuffle" size={28} color={shuffleOn ? colors.light : colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => TrackPlayer.skipToPrevious()}>
                <Ionicons name="play-skip-back" size={38} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.playCircle}
                onPress={() => (isPlaying ? TrackPlayer.pause() : TrackPlayer.play())}
            >
                <Ionicons name={isPlaying ? 'pause' : 'play'} size={42} color={colors.background} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => TrackPlayer.skipToNext()}>
                <Ionicons name="play-skip-forward" size={38} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity onPress={onCycleRepeat} style={styles.repeatButton}>
                <Ionicons name="repeat" size={28} color={repeatColor} />
                {isRepeatOne && (
                    <View style={styles.repeatBadge}>
                        <Text style={[styles.repeatBadgeText, { color: repeatColor }]}>1</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
}