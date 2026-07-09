import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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

export default function ReproductionControls({ 
    isPlaying, shuffleOn, onToggleShuffle, repeatState, onCycleRepeat 
}: ReproductionControlsProps) {

    const getRepeatIconColor = () => {
        if (repeatState === RepeatMode.Queue || repeatState === RepeatMode.Track) return '#00ffcc';
        return colors.textMuted;
    };

    const getRepeatIconName = () => {
        if (repeatState === RepeatMode.Track) return 'repeat-one';
        return 'repeat';
    };

    return (
        <View style={styles.controlsRow}>
            <TouchableOpacity onPress={onToggleShuffle}>
                <MaterialIcons name="shuffle" size={28} color={shuffleOn ? colors.light : colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => TrackPlayer.skipToPrevious()}>
                <MaterialIcons name="skip-previous" size={38} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.playCircle}
                onPress={() => isPlaying ? TrackPlayer.pause() : TrackPlayer.play()}
            >
                <MaterialIcons name={isPlaying ? "pause" : "play-arrow"} size={42} color={colors.black} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => TrackPlayer.skipToNext()}>
                <MaterialIcons name="skip-next" size={38} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity onPress={onCycleRepeat}>
                <MaterialIcons name={getRepeatIconName()} size={28} color={colors.light} />
            </TouchableOpacity>
        </View>
    );
}