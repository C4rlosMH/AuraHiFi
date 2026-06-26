import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import TrackPlayer, { RepeatMode } from 'react-native-track-player';
import { styles } from './ReproductionControls.styles';

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
        return 'rgba(255,255,255,0.6)';
    };

    const getRepeatIconName = () => {
        if (repeatState === RepeatMode.Track) return 'repeat-one';
        return 'repeat';
    };

    return (
        <View style={styles.controlsRow}>
            <TouchableOpacity onPress={onToggleShuffle}>
                <MaterialIcons name="shuffle" size={28} color={shuffleOn ? '#00ffcc' : 'rgba(255,255,255,0.6)'} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => TrackPlayer.skipToPrevious()}>
                <MaterialIcons name="skip-previous" size={38} color="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.playCircle}
                onPress={() => isPlaying ? TrackPlayer.pause() : TrackPlayer.play()}
            >
                <MaterialIcons name={isPlaying ? "pause" : "play-arrow"} size={42} color="#000000" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => TrackPlayer.skipToNext()}>
                <MaterialIcons name="skip-next" size={38} color="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={onCycleRepeat}>
                <MaterialIcons name={getRepeatIconName()} size={28} color={getRepeatIconColor()} />
            </TouchableOpacity>
        </View>
    );
}