import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Canvas, Image as SkiaImage, useImage, Blur, Group } from '@shopify/react-native-skia';
import { styles } from './GlassPanel.styles';

interface GlassPanelProps {
    artwork?: string;
    children: React.ReactNode;
}

const { width, height } = Dimensions.get('window');

export default function GlassPanel({ artwork, children }: GlassPanelProps) {
    // Skia lee la imagen directamente hacia la memoria de la GPU
    const skiaImage = useImage(artwork);

    return (
        <View style={styles.panelContainer}>
            {skiaImage && (
                <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
                    <Canvas style={StyleSheet.absoluteFillObject}>
                        <Group
                            origin={{ x: width / 2, y: height / 4 }}
                            transform={[
                                { scale: 1.25 },
                                { translateX: -12 },
                                { translateY: 12 }
                            ]}
                        >
                            <SkiaImage
                                image={skiaImage}
                                x={-50}
                                y={-50}
                                width={width + 100}
                                height={height}
                                fit="cover"
                            >
                                {/* Aplicamos la propiedad correcta de Skia */}
                                <Blur blur={8} />
                            </SkiaImage>
                        </Group>
                    </Canvas>
                </View>
            )}
            
            <View style={styles.contrastOverlay} />
            
            {/* Contenido de la interfaz inyectado */}
            {children}
        </View>
    );
}