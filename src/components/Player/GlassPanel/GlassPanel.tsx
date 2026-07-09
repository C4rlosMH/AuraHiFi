import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas, BackdropFilter, Blur, Fill } from '@shopify/react-native-skia';
import { styles } from './GlassPanel.styles';
import { colors } from '../../../styles/theme';

interface GlassPanelProps {
    artwork?: string;
    children: React.ReactNode;
}

const GlassPanel: React.FC<GlassPanelProps> = ({ children }) => {
    return (
        <View style={styles.panelContainer}>
            
            {/* 💎 MAGIA PURA: Motor Skia forzando el Frosted Glass en tiempo real */}
            <Canvas style={StyleSheet.absoluteFill}>
                {/* 🔥 AQUÍ ESTÁ LA CORRECCIÓN: Usamos la propiedad única 'blur' */}
                <BackdropFilter filter={<Blur blur={20} />}>
                    <Fill color={colors.progressBg} />
                </BackdropFilter>
            </Canvas>

            <View style={styles.contentContainer}>
                {children}
            </View>
        </View>
    );
};

export default GlassPanel;