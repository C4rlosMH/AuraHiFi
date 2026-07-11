import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { colors } from '../../../styles/theme';

const { height } = Dimensions.get('window');

interface PlayerBackgroundProps {
    artwork?: string;
}

export default function PlayerBackground({ artwork }: PlayerBackgroundProps) {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (artwork) {
            // Reiniciamos el valor a 0 al cambiar de canción
            spinValue.setValue(0);
            
            const spinAnimation = Animated.loop(
                Animated.timing(spinValue, {
                    toValue: 1,
                    duration: 35000, 
                    easing: Easing.linear, 
                    useNativeDriver: true, 
                    // 🚀 LA SOLUCIÓN DEFINITIVA: 
                    // Evita que el sistema operativo pause la rotación al tocar la pantalla
                    isInteraction: false, 
                })
            );
            
            spinAnimation.start();

            // Limpieza estricta para evitar animaciones duplicadas en memoria
            return () => {
                spinAnimation.stop();
            };
        }
    }, [artwork, spinValue]);

    if (!artwork) {
        return <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.background }]} />;
    }

    // Volvemos a la vuelta exacta de 360 grados
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'] 
    });

    return (
        <View style={[StyleSheet.absoluteFillObject, { overflow: 'hidden' }]}>
            <Animated.View 
                style={[
                    StyleSheet.absoluteFillObject,
                    {
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: [
                            { scale: 1.5 },
                            { rotate: spin } 
                        ]
                    }
                ]}
            >
                <Image 
                    source={{ uri: artwork }}
                    style={{ width: height * 1.5, height: height * 1.5 }} 
                    blurRadius={3} 
                    resizeMode="cover"
                />
            </Animated.View>
            
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.glassBadge }]} />
        </View>
    );
}