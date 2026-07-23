import React, { useState } from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AuraBackground from '../../../components/AuraBackground/AuraBackground';
import SettingsHeader from '../../../components/Settings/SettingsHeader/SettingsHeader';
import { styles } from './AudioSettingsScreen.styles';
import { colors } from '../../../styles/theme';

export default function AudioSettingsScreen() {
    const navigation = useNavigation<any>();

    const [losslessStreaming, setLosslessStreaming] = useState(true);
    const [losslessDownloads, setLosslessDownloads] = useState(true);
    const [cellularStreaming, setCellularStreaming] = useState(false);

    return (
        <AuraBackground>
            <View style={styles.container}>ññ2
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
                            onValueChange={setLosslessStreaming} 
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
                            onValueChange={setCellularStreaming} 
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
                            onValueChange={setLosslessDownloads} 
                            trackColor={{ false: colors.glassDark, true: colors.light }}
                            thumbColor={colors.primary}
                        />
                    </View>

                </ScrollView>
            </View>
        </AuraBackground>
    );
}