// src/screens/Library/LibraryScreen.tsx

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// --- Servicios y Estilos ---
import { navidromeApi, Track, Album, Playlist, Artist } from '../../services/navidromeApi';
import { pinService, PinItem } from '../../services/PinService';
import { localLibraryService } from '../../services/LocalLibraryService';
import { PlaylistMathService } from '../../services/PlaylistMathService'; 
import { playerService } from '../../services/PlayerService'; 

import { colors } from '../../styles/theme';
import { styles } from './LibraryScreen.styles'; 

// --- Componentes Modulares ---
import AuraBackground from '../../components/AuraBackground/AuraBackground';
import LibraryHeader from '../../components/Library/LibraryHeader/LibraryHeader';
import PinnedGrid from '../../components/Library/PinnedGrid/PinnedGrid';
import CollapsibleSection from '../../components/Library/CollapsibleSection/CollapsibleSection';
import CollectionGrid from '../../components/Library/CollectionGrid/CollectionGrid'; 
import ListRowCard from '../../components/Library/CollapsibleSection/ListRowCard';
import LibraryFAB from '../../components/Library/LibraryFAB/LibraryFAB';
import CategoryFilter from '../../components/Library/CategoryFilter/CategoryFilter';
import LibraryOptionsModal from '../../components/Library/LibraryOptionsModal/LibraryOptionsModal';
import CreatePlaylistModal from '../../components/Library/CreatePlaylistModal/CreatePlaylistModal';
import FusionBar from '../../components/Library/FusionBar/FusionBar';
import LocalSearchBar from '../../components/Common/LocalSearchBar/LocalSearchBar';


export default function LibraryScreen() {
    const navigation = useNavigation<any>();

    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const [localPins, setLocalPins] = useState<PinItem[]>([]); 
    const [recentAlbums, setRecentAlbums] = useState<Album[]>([]);
    const [unifiedCollection, setUnifiedCollection] = useState<any[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // 🚀 ESTADOS PARA LA TEORÍA DE CONJUNTOS
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [selectedPlaylistIds, setSelectedPlaylistIds] = useState<string[]>([]);
    const [isProcessingMath, setIsProcessingMath] = useState(false);

    const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);
    const [isCreatePlaylistModalVisible, setIsCreatePlaylistModalVisible] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchLibraryData = async () => {
        try {
            const [pins, recents, serverAlbums, serverPlaylists, serverArtists, offlineTracks] = await Promise.all([
                pinService.getPins(),
                navidromeApi.getRecentAlbums(9),
                navidromeApi.getAllAlbums(80),
                navidromeApi.getPlaylists(),
                navidromeApi.getArtists(),
                localLibraryService.getDownloadedTracks() 
            ]);
            
            setLocalPins(pins);
            setRecentAlbums(recents);

            const normalizeStr = (str: string) => String(str || '').toLowerCase().replace(/[^a-z0-9]/gi, '');

            const downloadedAlbumTitles = offlineTracks
                .map(track => normalizeStr(track.album))
                .filter(title => title.length > 0);

            const mappedAlbums = serverAlbums.map(a => {
                const safeTitle = normalizeStr(a.title);
                const isMatch = downloadedAlbumTitles.some(localTitle => 
                    localTitle.includes(safeTitle) || safeTitle.includes(localTitle)
                );
                return {
                    id: a.id, title: a.title, subtitle: `Album • ${a.artist}`,
                    imageUrl: a.coverArtUrl, type: 'album', isDownloaded: isMatch
                };
            });

            const mappedPlaylists = serverPlaylists.map(p => {
                const safeTitle = normalizeStr(p.title);
                const isMatch = downloadedAlbumTitles.some(localTitle => 
                    localTitle.includes(safeTitle) || safeTitle.includes(localTitle)
                );
                return {
                    id: p.id, title: p.title, subtitle: `Playlist • ${p.trackCount || 0} temas`,
                    imageUrl: p.coverArtUrl, type: 'playlist', isDownloaded: isMatch
                };
            });

            const mappedArtists = serverArtists.map(art => ({
                id: art.id, title: art.name, subtitle: `Artista • ${art.albumCount || 0} discos`,
                imageUrl: art.artistImageUrl, type: 'artist'
            }));

            const specialFolders = [
                { id: 'fav_folder', title: 'Favoritos', subtitle: 'Playlist de Aura', type: 'folder', iconName: 'heart' },
                { id: 'down_folder', title: 'Descargas', subtitle: 'Musica Offline', type: 'folder', iconName: 'cloud-download' }
            ];

            const masterList = [...specialFolders, ...mappedPlaylists, ...mappedAlbums, ...mappedArtists]
                .sort((a, b) => a.title.localeCompare(b.title));

            setUnifiedCollection(masterList);
        } catch (error) {
            console.error("Error consolidando la coleccion unificada:", error);
        } finally {
            setIsLoading(false);
        }
    };

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

    // 🚀 LÓGICA DE SELECCIÓN
    const handleItemLongPress = (id: string, type: string) => {
        if (type === 'playlist' && !isSelectMode) {
            setIsSelectMode(true);
            setSelectedPlaylistIds([id]);
        }
    };

    const toggleSelection = (id: string) => {
        setSelectedPlaylistIds(prev => {
            const updated = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
            if (updated.length === 0) setIsSelectMode(false);
            return updated;
        });
    };

    const cancelSelection = () => {
        setIsSelectMode(false);
        setSelectedPlaylistIds([]);
    };

    const handleItemPress = (id: string, title: string, type: string) => {
        if (isSelectMode) {
            if (type !== 'playlist') {
                Alert.alert("Aura Hi-Fi", "El Modo Fusión solo funciona entre Playlists.");
                return;
            }
            toggleSelection(id);
            return;
        }

        if (type === 'album') {
            navigation.navigate('CollectionDetail', { id, type: 'album', title });
        } else if (type === 'playlist') {
            navigation.navigate('CollectionDetail', { id, type: 'playlist', title });
        } else if (type === 'artist') {
            navigation.navigate('ArtistDetail', { id, name: title });
        } else if (type === 'folder') {
            navigation.navigate('CollectionDetail', { id, type: 'local_folder', title });
        }
    };

    const executeMathOperation = async (operation: 'union' | 'intersection' | 'difference') => {
        if (selectedPlaylistIds.length < 2) return;
        
        try {
            setIsProcessingMath(true);
            let resultTracks: Track[] = [];
            
            // Textos amigables para la UI
            let operationTitle = "";

            if (operation === 'union') {
                resultTracks = await PlaylistMathService.getUnionFromIds(...selectedPlaylistIds);
                operationTitle = "Unión de Listas (Fusión)";
            } else if (operation === 'intersection') {
                resultTracks = await PlaylistMathService.getIntersectionFromIds(...selectedPlaylistIds);
                operationTitle = "Intersección (Coincidencias)";
            } else if (operation === 'difference') {
                const [baseId, ...restIds] = selectedPlaylistIds;
                resultTracks = await PlaylistMathService.getDifferenceFromIds(baseId, ...restIds);
                operationTitle = "Resta de Listas";
            }

            if (resultTracks.length > 0) {
                // 🚀 AQUÍ ESTÁ EL CAMBIO: Navegamos a la pantalla de resultados
                navigation.navigate('MathResult', { 
                    tracks: resultTracks, 
                    operationName: operationTitle 
                });
                cancelSelection();
            } else {
                Alert.alert("Aura Hi-Fi", "El cruce de estas listas no arrojó ninguna canción en común.");
            }
        } catch (error) {
            console.error("Error matemático:", error);
            Alert.alert("Error", "No se pudo procesar la matemática de las playlists.");
        } finally {
            setIsProcessingMath(false);
        }
    };

    const handleCategorySelect = (category: string | null) => {
        setActiveCategory(category); 
    };

    const getFilteredData = () => {
        // 1. Filtro por Categoría
        let filtered = unifiedCollection;
        if (activeCategory === 'Álbumes') filtered = unifiedCollection.filter(item => item.type === 'album');
        else if (activeCategory === 'Playlists') filtered = unifiedCollection.filter(item => item.type === 'playlist');
        else if (activeCategory === 'Artistas') filtered = unifiedCollection.filter(item => item.type === 'artist');
        else if (activeCategory === 'guardados') filtered = unifiedCollection.filter(item => item.isDownloaded === true);

        // 2. Filtro por Búsqueda (Texto)
        if (isSearchVisible && searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item => {
                const safeTitle = String(item.title || item.name || '').toLowerCase();
                const safeSubtitle = String(item.artist || item.subtitle || item.owner || '').toLowerCase();
                return safeTitle.includes(query) || safeSubtitle.includes(query);
            });
        }

        return filtered; 
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
                    {isSelectMode ? (
                        <View style={styles.selectionHeader}>
                            <Text style={styles.selectionTitle}>
                                {selectedPlaylistIds.length} Playlists
                            </Text>
                            <TouchableOpacity onPress={cancelSelection} style={styles.cancelButton}>
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <LibraryHeader 
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            isSearchVisible={isSearchVisible}
                            setIsSearchVisible={setIsSearchVisible}
                            activeCategory={activeCategory}
                        />
                    )}

                    <CategoryFilter 
                        activeCategory={activeCategory}
                        onSelectCategory={handleCategorySelect} 
                    />

                    {activeCategory === null && localPins.length > 0 && (
                        <PinnedGrid 
                            title="Pins" 
                            data={localPins} 
                            onItemPress={(id, title) => {
                                const clickedPin = localPins.find(p => p.id === id);
                                handleItemPress(id, title, clickedPin?.type || 'album');
                            }} 
                            isPinnedSection={true} 
                        />
                    )}

                    {activeCategory === null && recentAlbums.length > 0 && (
                        <CollapsibleSection title="Agregado recientemente">
                            {recentAlbums.slice(0, 9).map((album) => (
                                <ListRowCard
                                    key={`recent-${album.id}`}
                                    id={album.id} title={album.title} subtitle={album.artist}
                                    imageUrl={album.coverArtUrl}
                                    onPress={() => handleItemPress(album.id, album.title, 'album')}
                                />
                            ))}
                        </CollapsibleSection>
                    )}

                    <View style={styles.sectionWrapper}>
                        {/* 🚀 Dejamos el CollectionGrid limpio, la función getFilteredData() ya hace toda la magia por detrás */}
                        <CollectionGrid 
                            title={activeCategory === null ? "Tu Coleccion" : activeCategory}
                            data={getFilteredData()}
                            onItemPress={handleItemPress}
                            onItemLongPress={handleItemLongPress}
                            isSelectMode={isSelectMode}
                            selectedIds={selectedPlaylistIds}
                        />
                    </View>
                </ScrollView>

                {isSelectMode && selectedPlaylistIds.length >= 2 && (
                    <FusionBar 
                        isProcessing={isProcessingMath}
                        onUnion={() => executeMathOperation('union')}
                        onIntersection={() => executeMathOperation('intersection')}
                        onDifference={() => executeMathOperation('difference')}
                    />
                )}

                {/* 🚀 EL BOTÓN HÍBRIDO (VUELVE A LA VIDA) */}
                {!isSelectMode && (
                    <LibraryFAB 
                        onPress={() => setIsOptionsModalVisible(true)}
                    />
                )}
                <LibraryOptionsModal 
                    isVisible={isOptionsModalVisible}
                    onClose={() => setIsOptionsModalVisible(false)}
                    onTriggerMathMode={() => setIsSelectMode(true)} 
                    onTriggerNewPlaylist={() => setIsCreatePlaylistModalVisible(true)} 
                    onTriggerSearch={() => setIsSearchVisible(true)} // 🚀 Enciende el buscador del Header
                />

                <CreatePlaylistModal 
                    isVisible={isCreatePlaylistModalVisible}
                    onClose={() => setIsCreatePlaylistModalVisible(false)}
                    // 👇 Esto es magia: usamos la función de recarga nativa que ya tenías
                    onSuccess={() => {
                        Alert.alert("Aura Hi-Fi", "Playlist creada con éxito.");
                        onRefresh(); // ¡Refresca la UI al instante!
                    }}
                />
            </View>
        </AuraBackground>
    );
}