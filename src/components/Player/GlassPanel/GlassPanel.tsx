// src/components/GlassPanel/GlassPanel.tsx
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { styles } from './GlassPanel.styles'; // 🔥 Ahora importa sus propios estilos locales

interface GlassPanelProps {
    artwork?: string;
    children: React.ReactNode;
}

export default function GlassPanel({ artwork, children }: GlassPanelProps) {
    return (
        <View style={styles.panelContainer}>
            {/* 🔍 EL LENTE ÓPTICO (NUESTRO CRISTAL TRANSPARENTE) */}
            {artwork && (
                <View pointerEvents="none" style={styles.lensWrapper}>
                    <Image 
                        source={{ uri: artwork }}
                        style={styles.lensImage}
                        blurRadius={40}
                    />
                    <View style={styles.contrastOverlay} />
                </View>
            )}

            {/* Inyección automática del contenido flotante de la UI */}
            {children}
        </View>
    );
}