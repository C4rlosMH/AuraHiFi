import React from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AuraBackground from '../../components/AuraBackground/AuraBackground';
import SettingsHeader from '../../components/Settings/SettingsHeader/SettingsHeader';
import SettingsOptionRow from '../../components/Settings/SettingsOptionRow/SettingsOptionRow';

import { styles } from './SettingsMainScreen.styles';

export default function SettingsMainScreen() {
    const navigation = useNavigation<any>();

    return (
        <AuraBackground>
            <View style={styles.container}>
                {/* 🚀 COMPONENTE 1: Header */}
                <SettingsHeader 
                    title="Ajustes" 
                    onBack={() => navigation.goBack()} 
                />
                
                {/* 🚀 COMPONENTE 2: Filas Reutilizables */}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    
                    <SettingsOptionRow 
                        title="Audio y Reproducción" 
                        subtitle="Calidad Lossless, ecualizador y preferencias de streaming."
                        iconName="musical-notes-outline"
                        onPress={() => navigation.navigate('AudioSettings')}
                    />
                    
                    <SettingsOptionRow 
                        title="Almacenamiento y Descargas" 
                        subtitle="Gestión de caché, letras offline y descargas locales."
                        iconName="download-outline"
                        onPress={() => navigation.navigate('StorageSettings')}
                    />
                    
                    <SettingsOptionRow 
                        title="Apariencia e Interfaz" 
                        subtitle="Personaliza el comportamiento visual del reproductor."
                        iconName="color-palette-outline"
                        onPress={() => console.log('Ir a Appearance')} 
                    />

                    <SettingsOptionRow 
                        title="Servidor y Red" 
                        subtitle="Conexión con Navidrome e integración con Lidarr."
                        iconName="server-outline"
                        onPress={() => console.log('Ir a Server')} 
                    />
                    
                </ScrollView>
            </View>
        </AuraBackground>
    );
}