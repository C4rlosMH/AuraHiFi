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

            if (operation === 'union') {
                resultTracks = await PlaylistMathService.getUnionFromIds(...selectedPlaylistIds);
            } else if (operation === 'intersection') {
                resultTracks = await PlaylistMathService.getIntersectionFromIds(...selectedPlaylistIds);
            } else if (operation === 'difference') {
                const [baseId, ...restIds] = selectedPlaylistIds;
                resultTracks = await PlaylistMathService.getDifferenceFromIds(baseId, ...restIds);
            }

            if (resultTracks.length > 0) {
                playerService.playCollection(resultTracks[0], resultTracks);
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
        if (activeCategory === null) return unifiedCollection;
        if (activeCategory === 'Álbumes') return unifiedCollection.filter(item => item.type === 'album');
        if (activeCategory === 'Playlists') return unifiedCollection.filter(item => item.type === 'playlist');
        if (activeCategory === 'Artistas') return unifiedCollection.filter(item => item.type === 'artist');
        if (activeCategory === 'guardados') return unifiedCollection.filter(item => item.isDownloaded === true);
        return []; 
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
                        <LibraryHeader />
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
                    <View style={styles.fusionBar}>
                        {isProcessingMath ? (
                            <ActivityIndicator size="small" color={colors.accent} />
                        ) : (
                            <>
                                <TouchableOpacity style={styles.fusionBtn} onPress={() => executeMathOperation('union')}>
                                    <Text style={styles.btnIcon}>∪</Text>
                                    <Text style={styles.btnText}>Unir</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.fusionBtn} onPress={() => executeMathOperation('intersection')}>
                                    <Text style={styles.btnIcon}>∩</Text>
                                    <Text style={styles.btnText}>Cruzar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.fusionBtn} onPress={() => executeMathOperation('difference')}>
                                    <Text style={styles.btnIcon}>−</Text>
                                    <Text style={styles.btnText}>Restar</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                )}

                {!isSelectMode && <LibraryFAB onPress={() => console.log('Acciones de Biblioteca')} />}
            </View>
        </AuraBackground>
    );
}