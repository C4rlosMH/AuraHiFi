import React, { useState, useEffect } from 'react';
import { View, Text, SectionList, ActivityIndicator, Alert } from 'react-native';
import { styles } from './GlobalSearchScreen.styles';
import { colors } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';

import GlobalSearchBar from '../../components/Search/GlobalSearchBar/GlobalSearchBar';
import ExploreGrid, { ExploreCategory } from '../../components/Search/ExploreGrid/ExploreGrid';
import UnifiedResultRow from '../../components/Search/UnifiedResultRow/UnifiedResultRow';
import AuraBackground from '../../components/AuraBackground/AuraBackground';


import { globalSearchManager, UnifiedSearchItem } from '../../services/globalSearchManager';
import { playerService } from '../../services/PlayerService';
import { buildUrl, navidromeApi } from '../../services/navidromeApi';
import { VirtualLibraryService } from '../../services/VirtualLibraryService';
import { lidarrService } from '../../services/lidarrService';

export default function GlobalSearchScreen() {
    const navigation = useNavigation<any>(); // Usamos any de momento para evitar errores de tipado en las rutas
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [nasResults, setNasResults] = useState<UnifiedSearchItem[]>([]);
    const [globalResults, setGlobalResults] = useState<UnifiedSearchItem[]>([]);

    useEffect(() => {
        const performSearch = async () => {
            if (searchQuery.trim().length === 0) {
                setNasResults([]);
                setGlobalResults([]);
                return;
            }

            setIsLoading(true);
            try {
                // Buscamos en el Servidor y en Internet al mismo tiempo
                const [nasData, globalDataRaw] = await Promise.all([
                    globalSearchManager.searchNas(searchQuery),
                    globalSearchManager.searchGlobal(searchQuery)
                ]);

                // FILTRO DE PRIORIDAD: Lo que ya está en tu Servidor, se borra de Internet
                const existingTitles = new Set();
                nasData.forEach(item => existingTitles.add(item.title.toLowerCase()));

                const filteredGlobalData = globalDataRaw.filter(
                    item => !existingTitles.has(item.title.toLowerCase())
                );

                setNasResults(nasData);
                setGlobalResults(filteredGlobalData);

            } catch (error) {
                console.error("Error en la busqueda unificada:", error);
            } finally {
                setIsLoading(false);
            }
        };

        performSearch();
    }, [searchQuery]);

    const handleCategoryPress = (category: ExploreCategory) => {
        // Navegamos a la nueva pantalla pasando el nombre del género como parámetro
        navigation.navigate('ExploreGenre', { 
            genre: category.title 
        });
    };

    const handleItemPress = (item: UnifiedSearchItem) => {
        if (item.type === 'artist') {
            navigation.navigate('ArtistDetail', { 
                id: item.id, 
                name: item.title 
            });
        } else if (item.type === 'album') {
            navigation.navigate('CollectionDetail', { 
                id: item.id, 
                type: 'album', 
                title: item.title,
                imageUrl: item.coverArtUrl
            });
        } else if (item.type === 'track') {
            const cleanArtistName = item.subtitle.replace(' • Canción', '');

            const trackToPlay = {
                id: item.id,
                title: item.title,
                artist: cleanArtistName,
                album: "Canción Individual",
                duration: 0, // Soluciona el error de TypeScript
                coverArtUrl: item.coverArtUrl,
                streamUrl: buildUrl('stream', { id: item.id }),
                artwork: item.coverArtUrl, 
                url: buildUrl('stream', { id: item.id }) 
            };

            playerService.playCollection(trackToPlay, [trackToPlay]);
        }
    };

    const handleActionPress = async (item: UnifiedSearchItem) => {
        // 1. Reproducir canción suelta
        if (item.type === 'track') {
            handleItemPress(item);
            return;
        }

        // 2. Guardar Álbum del Servidor NAS
        if (item.source === 'nas' && item.type === 'album') {
            if (item.isSaved) return;

            try {
                const albumDetails = await navidromeApi.getAlbumDetails(item.id);
                
                if (albumDetails.tracks && albumDetails.tracks.length > 0) {
                    const trackRepId = albumDetails.tracks[0].id;
                    await VirtualLibraryService.toggleAlbumInLibrary(item.id, trackRepId);

                    setNasResults(prevResults => 
                        prevResults.map(nasItem => 
                            nasItem.id === item.id 
                                ? { ...nasItem, isSaved: true } 
                                : nasItem
                        )
                    );
                } else {
                    Alert.alert("Aviso", "Este álbum no tiene canciones válidas.");
                }
            } catch (error) {
                console.error("Error guardando álbum del NAS:", error);
                Alert.alert("Error", "No se pudo guardar el álbum en la biblioteca.");
            }
            return;
        }

        // 3. Puente hacia Lidarr (Búsquedas en Internet)
        if (item.source === 'global') {
            const isAlbum = item.type === 'album';
            
            // Extraemos el artista (del title si es artista, del subtitle si es album)
            let artistToSearch = isAlbum ? item.subtitle : item.title;
            artistToSearch = artistToSearch.replace(' • Canción', '').trim();

            // Extraemos el nombre del album si aplica
            const specificAlbumTitle = isAlbum ? item.title : undefined;

            try {
                // Le enviamos ambos datos al servicio
                const result = await lidarrService.addAndMonitor(artistToSearch, specificAlbumTitle);
                
                if (result.success) {
                    Alert.alert("Lidarr Notificado", result.message);
                } else {
                    Alert.alert("Error en Lidarr", result.message);
                }
            } catch (error) {
                Alert.alert("Error", "Ocurrió un problema al enviar la orden a Lidarr.");
            }
        }
    };

    // Solo quedan dos secciones
    const sections = [
        { title: 'Escucha Ahora', data: nasResults },
        { title: 'Explora', data: globalResults },
    ].filter(section => section.data.length > 0);

    return (
        <AuraBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Buscar</Text>
                    <GlobalSearchBar onSearch={setSearchQuery} />
                </View>

            {searchQuery.trim().length === 0 ? (
                <ExploreGrid onCategoryPress={handleCategoryPress} />
            ) : (
                <>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={colors.accent} />
                        </View>
                    ) : (
                        <SectionList
                            sections={sections}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <UnifiedResultRow 
                                    item={item} 
                                    onPress={handleItemPress}
                                    onActionPress={handleActionPress}
                                />
                            )}
                            renderSectionHeader={({ section: { title } }) => (
                                <Text style={styles.sectionHeader}>{title}</Text>
                            )}
                            contentContainerStyle={styles.listContainer}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>
                                    No se encontraron resultados para "{searchQuery}"
                                </Text>
                            }
                        />
                    )}
                </>
            )}
        </View>
    </AuraBackground>
    );
}