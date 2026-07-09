import React, { useState, useCallback } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import ImageColors from 'react-native-image-colors';
import { colors, gradients } from '../../styles/theme';

interface AuraBackgroundProps {
    children: React.ReactNode;
    forceType?: keyof typeof gradients; 
    coverUrl?: string; // NUEVA PROPIEDAD: La URL de la carátula
}

export default function AuraBackground({ children, forceType, coverUrl }: AuraBackgroundProps) {
    const [currentColors, setCurrentColors] = useState<readonly [string, string, string]>(gradients.nebulosa);

    useFocusEffect(
        useCallback(() => {
            // 1. Si forzamos un tipo específico
            if (forceType) {
                setCurrentColors(gradients[forceType]);
                return;
            }

            // 2. MAGIA AUDIÓFILA: Si hay una carátula, extraemos sus colores
            if (coverUrl) {
                console.log(`🎨 Extrayendo colores de: ${coverUrl}`);
                
                ImageColors.getColors(coverUrl, {
                    fallback: colors.background, // Color por si falla
                    cache: true,         // Lo guarda en RAM para que sea instantáneo al regresar
                    key: coverUrl,       // Llave de caché
                }).then((result) => {
                    let extractedGradient: readonly [string, string, string] = gradients.nebulosa;

                    // Extraemos los colores nativos de Android
                    if (result.platform === 'android') {
                        // Usamos darkVibrant o dominant para no cegar al usuario con fondos muy claros
                        const colorTop = result.darkVibrant || result.dominant || '#230C3A';
                        const colorMid = result.average || result.muted || '#0D1B40';
                        
                        // Fusionamos con un negro profundo abajo para que la lista de canciones se lea perfecto
                        extractedGradient = [colorTop, colorMid, '#03050A'];
                    } 
                    // (Opcional) Por si algún día lo compilas en iPhone
                    else if (result.platform === 'ios') {
                        const colorTop = result.primary || '#230C3A';
                        const colorMid = result.background || '#0D1B40';
                        extractedGradient = [colorTop, colorMid, '#03050A'];
                    }

                    console.log(`🌌 Fondo dinámico aplicado con éxito`);
                    setCurrentColors(extractedGradient);
                }).catch((error) => {
                    console.log("Error al extraer colores, usando aleatorio", error);
                    setRandomGradient();
                });

                return;
            }
            
            // 3. Si no hay ni forceType ni coverUrl (Pantallas como Home o Library)
            setRandomGradient();

        }, [forceType, coverUrl])
    );

    // Función auxiliar para elegir color al azar
    const setRandomGradient = () => {
        const keys = Object.keys(gradients) as Array<keyof typeof gradients>;
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        console.log(`🌌 AuraBackground aleatorio: ${randomKey}`);
        setCurrentColors(gradients[randomKey]);
    };

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