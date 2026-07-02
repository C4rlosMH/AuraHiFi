import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { styles } from './GlassPanel.styles';

interface GlassPanelProps {
    artwork?: string; // 🔥 Mantenemos esta propiedad para que PlayerScreen no se queje
    children: React.ReactNode;
}

const GlassPanel: React.FC<GlassPanelProps> = ({ children }) => {
    return (
        <View style={styles.panelContainer}>
            {/* La magia de Aura Frosted: un Gaussian Blur nativo optimizado */}
            <BlurView 
                style={StyleSheet.absoluteFill} 
                tint="default"       // Le da ese tono oscuro y elegante de Aura Hi-Fi
                intensity={15}    // Nivel del difuminado
            />
            {/* El contenido que va "flotando" sobre el cristal */}
            <View style={styles.contentContainer}>
                {children}
            </View>
        </View>
    );
};

// 🔥 AQUÍ ESTÁ LA SOLUCIÓN: Lo exportamos por defecto
export default GlassPanel;