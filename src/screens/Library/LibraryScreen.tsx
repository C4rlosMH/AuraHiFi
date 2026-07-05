import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// --- Servicios y Estilos ---
import { navidromeApi, Track, Album, Playlist, Artist} from '../../services/navidromeApi';
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
import ArtistGrid from '../../components/Library/ArtistGrid/ArtistGrid';


export default function LibraryScreen() {
    const navigation = useNavigation<any>();

    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Estados de datos separados
    const [localPins, setLocalPins] = useState<PinItem[]>([]); // 🚀 Pines locales de Aura
    const [recentAlbums, setRecentAlbums] = useState<Album[]>([]);
    const [allAlbums, setAllAlbums] = useState<Album[]>([]);

    const [myPlaylists, setMyPlaylists] = useState<Playlist[]>([]);
    const [Artists, setArtists] = useState<Artist[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Función unificada para tirar peticiones al NAS y a la memoria del Poco
    const fetchLibraryData = async () => {
        try {
            const [pins, recents, collection, playlists, artists] = await Promise.all([
                pinService.getPins(),         // Lee AsyncStorage local
                navidromeApi.getRecentAlbums(9),
                navidromeApi.getAllAlbums(100),
                navidromeApi.getPlaylists(),
                navidromeApi.getArtists()
            ]);
            
            setLocalPins(pins);
            setRecentAlbums(recents);
            setAllAlbums(collection);
            setMyPlaylists(playlists);
            setArtists(artists);
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

                    {/* 🚀 EL FILTRO VIVO (Le inyectamos el estado) */}
                    <CategoryFilter 
                        activeCategory={activeCategory}
                        onSelectCategory={(categoria) => setActiveCategory(categoria)} 
                    />

                    {/* =========================================
                        VISTA 1: GENERAL / ÁLBUMES (Se muestra si no hay filtro o si eliges Álbumes)
                    ========================================= */}
                    {(activeCategory === null || activeCategory === 'Álbumes') && (
                        <>
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

                            {recentAlbums.length > 0 && (
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
                            )}

                            {allAlbums.length > 0 && (
                                <CollectionGrid 
                                    title="Tu Colección"
                                    data={allAlbums}
                                    onItemPress={(id, title) => handleOpenCollection(id, title, 'album')}
                                />
                            )}
                        </>
                    )}

                    {/* =========================================
                        VISTA 2: PLAYLISTS
                    ========================================= */}
                    {activeCategory === 'Playlists' && (
                        <>
                            {myPlaylists.length > 0 ? (
                                <CollectionGrid 
                                    title="Tus Playlists"
                                    data={myPlaylists.map(p => ({
                                        ...p,
                                        artist: `${p.trackCount || 0} canciones` 
                                    }))}
                                    onItemPress={(id, title) => handleOpenCollection(id, title, 'playlist')}
                                />
                            ) : (
                                <View style={{ padding: 20, alignItems: 'center' }}>
                                    <Text style={{ color: colors.textMuted }}>Aún no tienes Playlists creadas.</Text>
                                </View>
                            )}
                        </>
                    )}

                    {/* =========================================
                        VISTA 3: ARTISTAS (Plantilla futura)
                    ========================================= */}
                    {activeCategory === 'Artistas' && (
                        <>
                            {Artists.length > 0 ? (
                                <ArtistGrid 
                                    data={Artists}
                                    onItemPress={(id, name) => {
                                        navigation.navigate('ArtistDetail', { 
                                            id: id, 
                                            name: name 
                                        });
                                    }}
                                />
                            ) : (
                                <View style={styles.placeholderContainer}>
                                    <Text style={styles.placeholderHighlight}>Sin Artistas</Text>
                                    <Text style={styles.placeholderText}>Tu biblioteca aún no tiene artistas indexados.</Text>
                                </View>
                            )}
                        </>
                    )}

                    {/* =========================================
                        VISTA 4: GUARDADOS / OFFLINE (Plantilla futura)
                    ========================================= */}
                    {activeCategory === 'guardados' && (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text style={{ color: colors.accent, fontWeight: 'bold' }}>Modo Sin Conexión</Text>
                            <Text style={{ color: colors.textMuted, textAlign: 'center', marginTop: 10 }}>
                                Aquí mostraremos la música FLAC descargada en el almacenamiento de tu celular.
                            </Text>
                        </View>
                    )}
                    
                </ScrollView>

                <LibraryFAB onPress={() => console.log('Acción global FAB')} />
            </View>
        </AuraBackground>
    );
}