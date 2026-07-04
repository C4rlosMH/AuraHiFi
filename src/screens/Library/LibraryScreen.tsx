import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// --- Servicios y Estilos ---
import { navidromeApi, Track, Album, Playlist} from '../../services/navidromeApi';
import { pinService, PinItem } from '../../services/PinService';
import { colors } from '../../styles/theme';
import { styles } from './LibraryScreen.styles'; // 🚀 IMPORTACIÓN CORRECTA

// --- Componentes Modulares ---
import AuraBackground from '../../components/AuraBackground/AuraBackground';
import LibraryHeader from '../../components/Library/LibraryHeader/LibraryHeader';
import PinnedGrid from '../../components/Library/PinnedGrid/PinnedGrid';
import CollapsibleSection from '../../components/Library/CollapsibleSection/CollapsibleSection';
import CollectionGrid from '../../components/Library/CollectionGrid/CollectionGrid'; // 🚀 NUEVO COMPONENTE
import ListRowCard from '../../components/Library/CollapsibleSection/ListRowCard';
import LibraryFAB from '../../components/Library/LibraryFAB/LibraryFAB';
import CategoryFilter from '../../components/Library/CategoryFilter/CategoryFilter';



export default function LibraryScreen() {
    const navigation = useNavigation<any>();

    // Estados de datos separados
    const [localPins, setLocalPins] = useState<PinItem[]>([]); // 🚀 Pines locales de Aura
    const [recentAlbums, setRecentAlbums] = useState<Album[]>([]);
    const [allAlbums, setAllAlbums] = useState<Album[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Función unificada para tirar peticiones al NAS y a la memoria del Poco
    const fetchLibraryData = async () => {
        try {
            const [pins, recents, collection] = await Promise.all([
                pinService.getPins(),         // Lee AsyncStorage local
                navidromeApi.getRecentAlbums(5),
                navidromeApi.getAllAlbums(50)
            ]);
            
            setLocalPins(pins);
            setRecentAlbums(recents);
            setAllAlbums(collection);
        } catch (error) {
            console.error("Error cargando componentes de biblioteca:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 🚀 TRUCO DE INGENIERÍA: useFocusEffect
    // Cada vez que el usuario regrese de la pantalla de detalles a la pestaña biblioteca,
    // este hook se disparará automáticamente para leer AsyncStorage y redibujar los Pines al instante.
    useFocusEffect(
        useCallback(() => {
            fetchLibraryData();
        }, [])
    );

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await fetchLibraryData();
        setIsRefreshing(false);
    }, []);

    // 🚀 EL MANEJADOR DE NAVEGACIÓN UNIVERSAL
    const handleOpenCollection = (id: string, title: string, itemType: 'album' | 'playlist' = 'album') => {
        navigation.navigate('CollectionDetail', { 
            id: id, 
            type: itemType, 
            title: title 
        });
    };

    if (isLoading) {
        return (
            <AuraBackground>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.accent} />
                </View>
            </AuraBackground>
        );
    }

    return (
        <AuraBackground>
            <View style={styles.container}>
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
                >
                    <LibraryHeader />

                    <CategoryFilter 
                        onSelectCategory={(categoria) => {
                            console.log("Filtrar la vista por:", categoria);
                        }} 
                    />

                    {/* 🚀 CONDICIÓN UX MAESTRA: Solo si hay pines, pintamos la grilla superior */}
                    {localPins.length > 0 && (
                        <PinnedGrid 
                            title="Pins" 
                            data={localPins} 
                            onItemPress={(id, title) => {
                                const clickedPin = localPins.find(p => p.id === id);
                                handleOpenCollection(id, title, clickedPin?.type || 'album');
                            }} 
                            isPinnedSection={true} 
                        />
                    )}

                    {/* 2. RECIENTEMENTE AGREGADOS */}
                    <CollapsibleSection title="Agregado recientemente">
                        {recentAlbums.slice(0, 9).map((album) => (
                            <ListRowCard
                                key={`recent-${album.id}`}
                                id={album.id}
                                title={album.title}
                                subtitle={album.artist}
                                imageUrl={album.coverArtUrl}
                                onPress={() => handleOpenCollection(album.id, album.title, 'album')}
                            />
                        ))}
                    </CollapsibleSection>

                    {/* 3. TU COLECCIÓN (Exclusiva, Fija y simétrica al 100% con los Pins) */}
                    {allAlbums.length > 0 && (
                        <CollectionGrid 
                            title="Tu Colección"
                            data={allAlbums}
                            onItemPress={(id, title) => handleOpenCollection(id, title, 'album')}
                        />
                    )}
                    
                </ScrollView>

                <LibraryFAB onPress={() => console.log('Crear Playlist')} />
            </View>
        </AuraBackground>
    );
}