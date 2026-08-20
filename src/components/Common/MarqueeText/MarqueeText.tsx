import React, { useState, useEffect, useRef } from 'react';
import { Animated, Easing, View, Text, StyleProp, TextStyle, StyleSheet, LayoutChangeEvent } from 'react-native';

interface MarqueeTextProps {
    text: string;
    style?: StyleProp<TextStyle>;
    duration?: number;
    delay?: number;
}

export default function MarqueeText({ text, style, duration = 8000, delay = 2000 }: MarqueeTextProps) {
    const [containerWidth, setContainerWidth] = useState(0);
    const [textWidth, setTextWidth] = useState(0);
    
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let animation: Animated.CompositeAnimation | null = null;

        if (textWidth > containerWidth && containerWidth > 0) {
            const distance = textWidth - containerWidth + 20; // 20px extra para que pase completamente

            animation = Animated.loop(
                Animated.sequence([
                    Animated.delay(delay), // Espera antes de empezar a moverse
                    Animated.timing(animatedValue, {
                        toValue: -distance,
                        duration: duration,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animatedValue, {
                        toValue: 0,
                        duration: 0, // Regresa al inicio instantáneamente
                        useNativeDriver: true,
                    }),
                ])
            );

            animation.start();
        } else {
            // Si el texto cambia y ahora es más corto, reseteamos
            animatedValue.setValue(0);
        }

        return () => {
            if (animation) {
                animation.stop();
            }
        };
    }, [textWidth, containerWidth, text, duration, delay]);

    const handleContainerLayout = (event: LayoutChangeEvent) => {
        setContainerWidth(event.nativeEvent.layout.width);
    };

    const handleTextLayout = (event: LayoutChangeEvent) => {
        setTextWidth(event.nativeEvent.layout.width);
    };

    const shouldAnimate = textWidth > containerWidth && containerWidth > 0;

    return (
        <View style={styles.container} onLayout={handleContainerLayout}>
            <Animated.View style={{ transform: [{ translateX: animatedValue }], flexDirection: 'row' }}>
                <Text 
                    style={[style, { flexWrap: 'nowrap' }]} 
                    onLayout={handleTextLayout}
                    numberOfLines={1}
                >
                    {text}
                </Text>
                
                {/* Truco: Si se anima, mostramos el texto una segunda vez muy lejos para que parezca un bucle continuo */}
                {shouldAnimate && (
                    <Text style={[style, { position: 'absolute', left: textWidth + 50 }]} numberOfLines={1}>
                        {text}
                    </Text>
                )}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        width: '100%',
    },
});