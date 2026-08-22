import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuraBackground from '../../../components/AuraBackground/AuraBackground';
import SettingsHeader from '../../../components/Settings/SettingsHeader/SettingsHeader';
import { styles } from './AudioSettingsScreen.styles';
import { colors } from '../../../styles/theme';

export default function AudioSettingsScreen() {
    const navigation = useNavigation<any>();

    const [losslessStreaming, setLosslessStreaming] = useState(true);
    const [cellularStreaming, setCellularStreaming] = useState(false);
    const [losslessDownloads, setLosslessDownloads] = useState(true);

    // 🚀 1. Cargar la configuración guardada al abrir la pantalla
    useEffect(() => {
        const loadAudioSettings = async () => {
            try {
                const savedLosslessStr = await AsyncStorage.getItem('@aura_lossless_streaming');
                const savedCellularStr = await AsyncStorage.getItem('@aura_cellular_streaming');
                const savedDownloads = await AsyncStorage.getItem('@aura_lossless_downloads');

                if (savedLosslessStr !== null) setLosslessStreaming(savedLosslessStr === 'true');
                if (savedCellularStr !== null) setCellularStreaming(savedCellularStr === 'true');
                if (savedDownloads !== null) setLosslessDownloads(savedDownloads === 'true');
            } catch (error) {
                console.log("Error cargando configuración de audio", error);
            }
        };
        loadAudioSettings();
    }, []);

    // 🚀 2. Envoltorios para actualizar la UI y guardar al mismo tiempo
    const toggleLosslessStreaming = async (value: boolean) => {
        setLosslessStreaming(value);
        await AsyncStorage.setItem('@aura_lossless_streaming', value.toString());
    };

    const toggleCellularStreaming = async (value: boolean) => {
        setCellularStreaming(value);
        await AsyncStorage.setItem('@aura_cellular_streaming', value.toString());
    };

    const toggleLosslessDownloads = async (value: boolean) => {
        setLosslessDownloads(value);
        await AsyncStorage.setItem('@aura_lossless_downloads', value.toString());
    };

    return (
        <AuraBackground>
            <View style={styles.container}>
                <SettingsHeader 
                    title="Audio y Reproducción" 
                    onBack={() => navigation.goBack()} 
                />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    
                    <Text style={styles.sectionTitle}>Calidad de Streaming</Text>
                    
                    <View style={styles.settingRow}>
                        <View style={styles.textContainer}>
                            <Text style={styles.settingTitle}>Streaming Lossless (Wi-Fi)</Text>
                            <Text style={styles.settingDescription}>
                                Solicita el archivo original (FLAC) al servidor sin transcodificación.
                            </Text>
                        </View>
                        <Switch 
                            value={losslessStreaming} 
                            onValueChange={toggleLosslessStreaming} 
                            trackColor={{ false: colors.glassDark, true: colors.light }}
                            thumbColor={colors.primary}
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.textContainer}>
                            <Text style={styles.settingTitle}>Ahorro de datos móviles</Text>
                            <Text style={styles.settingDescription}>
                                Limita el streaming a 320kbps MP3 cuando no estés conectado a Wi-Fi.
                            </Text>
                        </View>
                        <Switch 
                            value={cellularStreaming} 
                            onValueChange={toggleCellularStreaming} 
                            trackColor={{ false: colors.glassDark, true: colors.light }}
                            thumbColor={colors.primary}
                        />
                    </View>

                    <Text style={styles.sectionTitle}>Descargas Offline</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.textContainer}>
                            <Text style={styles.settingTitle}>Descargas Lossless</Text>
                            <Text style={styles.settingDescription}>
                                Guarda la música en tu dispositivo en su calidad original. Ocupará más espacio de almacenamiento.
                            </Text>
                        </View>
                        <Switch 
                            value={losslessDownloads} 
                            onValueChange={toggleLosslessDownloads} 
                            trackColor={{ false: colors.glassDark, true: colors.light }}
                            thumbColor={colors.primary}
                        />
                    </View>

                </ScrollView>
            </View>
        </AuraBackground>
    );
}