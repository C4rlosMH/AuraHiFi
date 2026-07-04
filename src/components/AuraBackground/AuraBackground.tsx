import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '../../styles/theme';

interface AuraBackgroundProps {
    children: React.ReactNode;
    type?: 'aurora' | 'nebulosa' | 'indigoOceano';
}

export default function AuraBackground({ children, type = 'nebulosa' }: AuraBackgroundProps) {
    // Seleccionamos el gradiente matemático elegido
    const colorsList = gradients[type] || gradients.nebulosa;

    return (
        <LinearGradient 
            colors={colorsList}
            // Diagonal perfecta (de arriba-izquierda a abajo-derecha) para que el difuminado sea ultra orgánico
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.absoluteContainer}
        >
            {/* Forzamos que la barra de estado superior sea translúcida y combine */}
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