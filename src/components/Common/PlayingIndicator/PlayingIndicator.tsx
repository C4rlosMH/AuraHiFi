import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { styles } from './PlayingIndicator.styles';
import { colors } from '../../../styles/theme';

interface PlayingIndicatorProps {
    isPlaying: boolean;
    color?: string; // Permitimos cambiar el color (por defecto será tu color light)
}

export default function PlayingIndicator({ isPlaying, color = colors.light }: PlayingIndicatorProps) {
    const bar1 = useRef(new Animated.Value(0.3)).current;
    const bar2 = useRef(new Animated.Value(0.6)).current;
    const bar3 = useRef(new Animated.Value(0.4)).current;
    const bar4 = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        if (isPlaying) {
            const animate = (anim: Animated.Value, duration: number) => {
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(anim, { toValue: 1, duration, useNativeDriver: true }),
                        Animated.timing(anim, { toValue: 0.3, duration, useNativeDriver: true })
                    ])
                ).start();
            };
            animate(bar1, 400);
            animate(bar2, 250);
            animate(bar3, 350);
            animate(bar4, 300);
        } else {
            bar1.stopAnimation(); bar2.stopAnimation(); bar3.stopAnimation(); bar4.stopAnimation();
            Animated.spring(bar1, { toValue: 0.2, useNativeDriver: true }).start();
            Animated.spring(bar2, { toValue: 0.2, useNativeDriver: true }).start();
            Animated.spring(bar3, { toValue: 0.2, useNativeDriver: true }).start();
            Animated.spring(bar4, { toValue: 0.2, useNativeDriver: true }).start();
        }
    }, [isPlaying]);

    return (
        <View style={styles.playingIndicator}>
            <Animated.View style={[styles.eqBar, { backgroundColor: color, transform: [{ scaleY: bar1 }] }]} />
            <Animated.View style={[styles.eqBar, { backgroundColor: color, transform: [{ scaleY: bar2 }] }]} />
            <Animated.View style={[styles.eqBar, { backgroundColor: color, transform: [{ scaleY: bar3 }] }]} />
            <Animated.View style={[styles.eqBar, { backgroundColor: color, transform: [{ scaleY: bar4 }] }]} />
        </View>
    );
}