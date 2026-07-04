import React, { useState, useCallback } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { gradients } from '../../styles/theme';

interface AuraBackgroundProps {
    children: React.ReactNode;
    forceType?: keyof typeof gradients; 
}

export default function AuraBackground({ children, forceType }: AuraBackgroundProps) {
    const [currentColors, setCurrentColors] = useState<readonly [string, string, string]>(gradients.nebulosa);

    useFocusEffect(
        useCallback(() => {
            if (forceType) {
                console.log(`🌌 AuraBackground activo (Fijo): ${forceType}`);
                setCurrentColors(gradients[forceType]);
                return;
            }
            
            const keys = Object.keys(gradients) as Array<keyof typeof gradients>;
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            
            // LOG AÑADIDO AQUÍ:
            console.log(`🌌 AuraBackground aleatorio activo: ${randomKey}`);
            
            setCurrentColors(gradients[randomKey]);

        }, [forceType])
    );

    return (
        <LinearGradient 
            colors={currentColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.absoluteContainer}
        >
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            {children}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    absoluteContainer: {
        flex: 1,
    },
});