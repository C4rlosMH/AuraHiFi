import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Canvas, Image as SkiaImage, useImage, Blur, ColorMatrix } from '@shopify/react-native-skia';
import { styles } from './GlassPanel.styles';

interface GlassPanelProps {
    artwork?: string;
    children: React.ReactNode;
}

// Obtenemos las dimensiones de TODA la pantalla
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SATURATION_MATRIX = [
    1.5, 0, 0, 0, -0.1,
    0, 1.5, 0, 0, -0.1,
    0, 0, 1.5, 0, -0.1,
    0, 0, 0, 1, 0,
];

export default function GlassPanel({ artwork, children }: GlassPanelProps) {
    const skiaImage = useImage(artwork);
    const viewRef = useRef<View>(null);
    
    // Guardaremos la posición Y exacta del panel en la pantalla
    const [offsetY, setOffsetY] = useState(0);

    // Esta función mide dónde está exactamente nuestro panel renderizado en el Poco X7 Pro
    const handleLayout = () => {
        viewRef.current?.measure((x, y, width, height, pageX, pageY) => {
            // pageY es la distancia desde el top de la pantalla hasta nuestro panel
            if (pageY > 0) {
                setOffsetY(pageY);
            }
        });
    };

    return (
        <View 
            ref={viewRef}
            onLayout={handleLayout}
            style={[styles.panelContainer, { overflow: 'hidden' }]}
        >
            {skiaImage && (
                <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
                    <Canvas style={StyleSheet.absoluteFillObject}>
                        <SkiaImage
                            image={skiaImage}
                            // Mantenemos X en 0, pero subimos Y de forma inversa a la posición del panel
                            x={0}
                            y={-offsetY} 
                            // Dibujamos la imagen al tamaño gigante de la pantalla
                            width={SCREEN_WIDTH}
                            height={SCREEN_HEIGHT}
                            fit="cover"
                        >
                            <ColorMatrix matrix={SATURATION_MATRIX} />
                            <Blur blur={1} mode="clamp" />
                        </SkiaImage>
                    </Canvas>
                </View>
            )}
            
            {/* Tinte oscuro del cristal para la lectura de letras */}
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0, 0, 0, 0.30)' }]} />
            
            {children}
        </View>
    );
}