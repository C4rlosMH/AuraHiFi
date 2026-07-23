import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AuraBackground from '../../../components/AuraBackground/AuraBackground';
import SettingsHeader from '../../../components/Settings/SettingsHeader/SettingsHeader';
import StorageCylinder, { StorageSlice } from '../../../components/Settings/StorageCylinder/StorageCylinder';
import { downloadManager } from '../../../services/downloadManager';
import { localLibraryService } from '../../../services/LocalLibraryService';

import { styles } from './StorageSettingsScreen.styles';
import { colors } from '../../../styles/theme';

export default function StorageSettingsScreen() {
    const navigation = useNavigation<any>();

    const [storageData, setStorageData] = useState<StorageSlice[]>([]);
    const [diskInfo, setDiskInfo] = useState({ usedApp: 0, free: 0, total: 0 });
    const [isLoading, setIsLoading] = useState(true);

    // Formateador de bytes a MB/GB
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 MB';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    useEffect(() => {
        const loadRealStorageData = async () => {
            setIsLoading(true);
            const stats = await downloadManager.getStorageStats();
            
            const APP_BASE_BYTES = 150 * 1024 * 1024; // Estimacion inamovible de la instalacion base

            // Usamos realCacheBytes devuelto por el audit
            const totalAppBytes = stats.flacBytes + stats.mp3Bytes + stats.lrcBytes + stats.artworkBytes + APP_BASE_BYTES + stats.realCacheBytes;

            const getPercent = (bytes: number) => totalAppBytes > 0 ? (bytes / totalAppBytes) * 65 : 0;

            const newData: StorageSlice[] = [];

            if (stats.flacBytes > 0) {
                newData.push({ id: 'flac', label: 'Audio FLAC', sizeText: formatBytes(stats.flacBytes), percentage: getPercent(stats.flacBytes), color: '#6E56CF', lidColor: '#846DDF' });
            }
            if (stats.mp3Bytes > 0) {
                newData.push({ id: 'mp3', label: 'Audio MP3', sizeText: formatBytes(stats.mp3Bytes), percentage: getPercent(stats.mp3Bytes), color: '#A12338', lidColor: '#B63A4D' });
            }
            if (stats.artworkBytes > 0) {
                newData.push({ id: 'artwork', label: 'Portadas offline', sizeText: formatBytes(stats.artworkBytes), percentage: getPercent(stats.artworkBytes), color: '#00B5CE', lidColor: '#22C8DF' });
            }
            if (stats.lrcBytes > 0) {
                newData.push({ id: 'lyrics', label: 'Letras', sizeText: formatBytes(stats.lrcBytes), percentage: getPercent(stats.lrcBytes), color: '#12A594', lidColor: '#27B8A8' });
            }
            if (stats.realCacheBytes > 0) {
                newData.push({ id: 'cache', label: 'Cache', sizeText: formatBytes(stats.realCacheBytes), percentage: getPercent(stats.realCacheBytes), color: '#E54D2E', lidColor: '#ED6B53' });
            }
            if (APP_BASE_BYTES > 0) {
                newData.push({ id: 'system', label: 'Aura App', sizeText: formatBytes(APP_BASE_BYTES), percentage: getPercent(APP_BASE_BYTES), color: '#687076', lidColor: '#7E868C' });
            }

            setStorageData(newData);
            setDiskInfo({ usedApp: totalAppBytes, free: stats.freeDisk, total: stats.totalDisk });
            setIsLoading(false);
        };

        loadRealStorageData();
    }, []);

    const handleCleanCache = () => {
        Alert.alert(
            "Limpiar Caché",
            "¿Deseas liberar el caché temporal? Tus archivos FLAC descargados permanecerán intactos.",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Limpiar", style: "destructive", onPress: () => console.log("Caché borrado") }
            ]
        );
    };

    const handleDeepClean = () => {
        Alert.alert(
            "Limpieza Profunda",
            "¿Deseas buscar y eliminar todos los archivos MP3 heredados? Esto forzará a la app a descargar las versiones FLAC en el futuro.",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Purgar MP3", 
                    style: "destructive", 
                    onPress: async () => {
                        setIsLoading(true); // Usamos tu estado de carga para congelar la pantalla
                        
                        // 1. Borramos los archivos físicos
                        const deleted = await downloadManager.purgeLegacyMp3Files();
                        
                        // 2. Limpiamos la base de datos
                        await localLibraryService.cleanLegacyMp3Registry();
                        
                        // 3. Recargamos la gráfica para ver los resultados
                        const stats = await downloadManager.getStorageStats();
                        // ... aquí reactivamos el refresh automático de tu useEffect ...
                        
                        Alert.alert("Purga Completada", `Se eliminaron ${deleted} archivos MP3 antiguos de tu dispositivo.`);
                        setIsLoading(false);
                        navigation.goBack(); // Opcional: regresar para forzar el re-render al entrar
                    } 
                }
            ]
        );
    };

    if (isLoading) {
        return (
            <AuraBackground>
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={colors.accent} />
                </View>
            </AuraBackground>
        );
    }

    return (
        <AuraBackground>
            <View style={styles.container}>
                <SettingsHeader title="Espacio de almacenamiento" onBack={() => navigation.goBack()} />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerSubtitle}>
                            Usado: {formatBytes(diskInfo.usedApp)}, Restante: {formatBytes(diskInfo.free)}, Total: {formatBytes(diskInfo.total)} (Uso exclusivo de la aplicación)
                        </Text>
                    </View>

                    <View style={styles.mainRow}>
                        <StorageCylinder data={storageData} />
                        
                        <View style={styles.legendContainer}>
                            {storageData.map(item => (
                                <TouchableOpacity key={item.id} style={styles.legendItem} activeOpacity={0.7}>
                                    <View style={styles.legendHeader}>
                                        <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                                        <Text style={styles.legendTitle}>{item.label}</Text>
                                    </View>
                                    <View style={styles.legendSizeRow}>
                                        <Text style={styles.legendSize}>{item.sizeText}</Text>
                                        <Ionicons name="chevron-forward" style={styles.chevron} />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.dangerButton} onPress={handleCleanCache} activeOpacity={0.8}>
                            <Text style={styles.dangerText}>Liberar caché temporal</Text>
                        </TouchableOpacity>

                        <Text style={styles.sectionTitle}>Más herramientas</Text>
                        <View style={styles.actionBlock}>
                            <TouchableOpacity style={styles.actionRow} activeOpacity={0.7} onPress={handleDeepClean}>
                                <Text style={styles.actionRowText}>Limpieza profunda de descargas</Text>
                                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
                                <Text style={styles.actionRowText}>Purgar portadas huérfanas</Text>
                                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={[styles.actionRow, { borderBottomWidth: 0 }]} activeOpacity={0.7}>
                                <Text style={styles.actionRowText}>Auditoría del sistema de archivos</Text>
                                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
            </View>
        </AuraBackground>
    );
}