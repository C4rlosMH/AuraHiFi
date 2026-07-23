import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Servicios ---
import { navidromeApi } from '../../services/navidromeApi';
import { pinService, PinItem } from '../../services/PinService';
import { playerService } from '../../services/PlayerService'; 
import { downloadManager } from '../../services/downloadManager'
import { localLibraryService } from '../../services/LocalLibraryService';
import { PlaylistManagerService } from '../../services/PlaylistManagerService';
import { VirtualLibraryService } from '../../services/VirtualLibraryService';

// --- Componentes ---
import AuraBackground from '../../components/AuraBackground/AuraBackground';
import CollectionHeader from '../../components/CollectionDetail/Header/CollectionHeader';
import CollectionCover from '../../components/CollectionDetail/Cover/CollectionCover';
import CollectionMetadata from '../../components/CollectionDetail/Metadata/CollectionMetadata';
import CollectionActions from '../../components/CollectionDetail/Actions/CollectionActions';
import CollectionTrackList from '../../components/CollectionDetail/TrackList/CollectionTrackList';
import LocalSearchBar from '../../components/Common/LocalSearchBar/LocalSearchBar';
import AddSongsModal from '../../components/CollectionDetail/AddSongsModal/AddSongsModal';
import CollectionOptionsModal from '../../components/Common/CollectionOptionsModal/CollectionOptionsModal';
import EditPlaylistModal from '../../components/CollectionDetail/EditPlaylistModal/EditPlaylistModal';
import SortOptionsModal, { SortType } from '../../components/Common/SortOptionsModal/SortOptionsModal';

// --- Estilos ---
import { styles } from './CollectionDetailScreen.styles';
import { colors } from '../../styles/theme';

export default function CollectionDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    
    // Obtenemos los parametros de navegacion
    const { id, type, title: initialTitle, imageUrl: initialImageUrl } = route.params as { 
        id: string, 
        type: 'album' | 'playlist' | 'local_folder', 
        title: string, 
        imageUrl?: string // <- Nuevo
    };

    // --- ESTADOS ---
    const [details, setDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPinned, setIsPinned] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [isAlbumSaved, setIsAlbumSaved] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [downloadProgress, setDownloadProgress] = useState<string | null>(null);
    const isPlaylist = type === 'playlist';
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isCollectionOptionsVisible, setIsCollectionOptionsVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const flatListRef = useRef<any>(null); // 🚀 Ahora referenciamos al FlatList
    const [isSortModalVisible, setIsSortModalVisible] = useState(false);
    const [currentSort, setCurrentSort] = useState<SortType>('custom');

    useEffect(() => {
        const loadSortPreference = async () => {
            if (type === 'playlist' || type === 'album') {
                try {
                    const savedSort = await AsyncStorage.getItem(`@sort_pref_${id}`);
                    if (savedSort) {
                        setCurrentSort(savedSort as SortType);
                    }
                } catch (error) {
                    console.log("No se pudo cargar la preferencia de orden", error);
                }
            }
        };
        loadSortPreference();
    }, [id, type]);

    useEffect(() => {
        if (!isLoading && type === 'playlist' && flatListRef.current) {
            // Le damos 150ms a Android para asegurar que la vista ya existe antes de moverla
            setTimeout(() => {
                flatListRef.current?.scrollToOffset({ offset: 90, animated: false });
            }, 150);
        }
    }, [isLoading, type]);

    // --- EFECTO DE CARGA INICIAL ---
    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setIsLoading(true);

            // 1. INTERCEPTOR LOCAL: Si es una carpeta offline
            if (type === 'local_folder') {
                const tracks = id === 'fav_folder'
                    ? await localLibraryService.getFavoritedTracks()
                    : await localLibraryService.getDownloadedTracks();

                setDetails({
                    id: id,
                    title: id === 'fav_folder' ? 'Tus Favoritos' : 'Descargas Locales',
                    artist: 'Aura Hi-Fi',
                    coverArtUrl: tracks.length > 0 ? tracks[0].coverArtUrl : '', 
                    tracks: tracks
                });
                
                setIsPinned(false);
                setIsDownloaded(true);
                setIsLiked(id === 'fav_folder'); 
                setIsLoading(false);
                return;
            }

            // 2. FLUJO NORMAL: Cargamos la info del NAS
            const data = type === 'album' 
                ? await navidromeApi.getAlbumDetails(id)
                : await navidromeApi.getPlaylistDetails(id);
            
            setDetails(data);

            // 3. HIDRATACION DE ESTADOS
            
            // A. Verificamos el Like
            setIsLiked(!!data.starred);

            // B. Verificamos el Pin
            const pinnedStatus = await pinService.isPinned(id);
            setIsPinned(pinnedStatus);

            // C. Verificamos si este album esta en la Biblioteca Virtual
            if (type === 'album') {
                const isSaved = await VirtualLibraryService.isAlbumSaved(id);
                setIsAlbumSaved(isSaved);
            }

            // D. Verificamos si esta descargado usando tu downloadManager
            if (data.tracks && data.tracks.length > 0) {
                const firstTrack = data.tracks[0];
                const fallbackArtist = type === 'album' ? (data as any).artist : (data as any).owner;
                const trackArtist = firstTrack.artist || fallbackArtist || "Aura Hi-Fi";
                
                const filename = downloadManager.getSafeFilename(firstTrack.title, trackArtist);
                const localUri = await downloadManager.getLocalUriIfExists(filename);
                
                setIsDownloaded(!!localUri); 
            } else {
                setIsDownloaded(false);
            }
            
        } catch (error) {
            console.error("Error cargando detalles:", error);
            Alert.alert("Error de conexion", "No se pudo cargar la coleccion desde el NAS.");
            navigation.goBack();
        } finally {
            setIsLoading(false);
        }
    };

    // --- FUNCIONES CONTROLADORAS ---
    const handleTogglePin = async () => {
        if (!details) return;

        if (type === 'local_folder') {
            Alert.alert("Carpetas Locales", "Estas carpetas ya forman parte permanente de tu biblioteca.");
            return;
        }
        
        const pinData: PinItem = {
            id: details.id,
            title: details.title,
            subtitle: details.artist || details.owner || 'Aura Hi-Fi',
            coverArtUrl: details.coverArtUrl,
            type: type as 'album' | 'playlist' 
        };

        const result = await pinService.togglePin(pinData);
        if (result.success) {
            setIsPinned(!isPinned);
        } else {
            Alert.alert("Biblioteca Llena", result.message);
        }
    };

    const handleToggleLike = async () => {
        if (type === 'playlist') {
            Alert.alert("Aviso", "Navidrome no permite guardar playlists enteras en favoritos, solo albumes o canciones.");
            return;
        }

        try {
            const newState = await navidromeApi.toggleStar(id, isLiked, 'album');
            setIsLiked(newState);
            
            // 🚀 DISPARAMOS EL AUTO-GUARDADO (Solo si estamos dando Like, no si lo estamos quitando)
            if (newState) {
                await ensureAlbumInVirtualLibrary();
            }
        } catch (error) {
            console.log("Toggle Star falló", error);
        }
    };

    const handleToggleLibrary = async () => {
        if (type !== 'album' || !details?.tracks || details.tracks.length === 0) return;

        const previousState = isAlbumSaved;
        setIsAlbumSaved(!previousState);

        try {
            const trackRepId = details.tracks[0].id;
            const newState = await VirtualLibraryService.toggleAlbumInLibrary(id, trackRepId);
            
            setIsAlbumSaved(newState);
            
            if (newState) {
                Alert.alert("Guardado", "El album se ha anadido a tu biblioteca.");
            } else {
                Alert.alert("Eliminado", "El album se ha quitado de tu biblioteca.");
            }
        } catch (error) {
            console.error("Error al alternar biblioteca:", error);
            setIsAlbumSaved(previousState);
            Alert.alert("Error", "No se pudo actualizar tu biblioteca. Revisa tu conexion.");
        }
    };

    const ensureAlbumInVirtualLibrary = async () => {
        // Filtro de seguridad: Solo actúa en álbumes con canciones
        if (type !== 'album' || !details?.tracks || details.tracks.length === 0) return;

        try {
            // Preguntamos directo al disco duro (evitamos errores de estado de React)
            const currentlySaved = await VirtualLibraryService.isAlbumSaved(id);
            
            if (!currentlySaved) {
                setIsAlbumSaved(true); // Encendemos el ícono visual al instante
                const trackRepId = details.tracks[0].id;
                await VirtualLibraryService.toggleAlbumInLibrary(id, trackRepId);
                console.log("✅ Álbum auto-guardado en biblioteca por descarga/like");
            }
        } catch (error) {
            console.error("Error en auto-guardado silencioso:", error);
            setIsAlbumSaved(false); // Revertimos solo si el NAS rechaza la conexión
        }
    };
    const handleDownload = async () => {
        if (!details || !details.tracks || details.tracks.length === 0) return;

        try {
            // 🚀 1. DISPARAMOS EL AUTO-GUARDADO ANTES DE HACER CUALQUIER OTRA COSA
            await ensureAlbumInVirtualLibrary();

            // 2. INICIO DE DESCARGA LOCAL
            setIsDownloaded(true); 
            setDownloadProgress("0%");

            // Preparamos el array de pistas, asegurándonos de extraer el suffix
            const tracksToProcess = details.tracks.map((t: any) => ({
                id: t.id,
                title: t.title,
                artist: t.artist || details.artist || "Aura Hi-Fi",
                album: t.album || details.title,
                duration: t.duration,
                coverArtUrl: t.coverArtUrl || details.coverArtUrl,
                streamUrl: t.streamUrl || t.url,
                suffix: t.suffix // <- IMPORTANTE: Pasamos el sufijo para respetar el FLAC
            }));

            // Usamos tu método existente para descargar el lote (solo ajustamos si internamente downloadCollection lo necesita, 
            // pero el que guarda realmente es el ciclo 'for' de abajo o el mismo método interno).
            await downloadManager.downloadCollection(tracksToProcess, (downloaded, total) => {
                const percentage = Math.round((downloaded / total) * 100);
                setDownloadProgress(`${percentage}%`);
            });

            console.log("Registrando pistas en la biblioteca offline...");
            
            // 🚀 3. EL BUCLE DE GUARDADO Y DESCARGA DE LETRAS
            for (const track of tracksToProcess) {
                // AQUÍ ESTÁ LA MAGIA: Llamamos a downloadTrack individualmente para que intente
                // rescatar el archivo (si ya existe por downloadCollection) Y disparar el rescate de las letras.
                const localUri = await downloadManager.downloadTrack(
                    track.streamUrl, 
                    track.title, 
                    track.artist, 
                    track.suffix, 
                    track.id // <- ESTE ES EL DATO CLAVE PARA LAS LETRAS
                );
                
                if (localUri) {
                    await localLibraryService.registerDownload(track, localUri);
                }
            }

            setDownloadProgress(null);
            Alert.alert("Descarga Completada", "La colección y sus letras han sido guardadas offline.");

        } catch (error) {
            console.error("Error en la descarga:", error);
            setIsDownloaded(false);
            setDownloadProgress(null);
            Alert.alert("Error", "Hubo un problema al descargar la música.");
        }
    };

    const handleRemoveDownload = async () => {
        if (!details || !details.tracks || details.tracks.length === 0) return;

        Alert.alert(
            "Eliminar Descarga",
            "¿Estas seguro de que deseas eliminar este contenido de tu dispositivo? Necesitaras conexion a internet para volver a escucharlo.",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            setIsDownloaded(false);
                            
                            for (const track of details.tracks) {
                                await localLibraryService.removeDownloadedTrack(track.id);
                                
                                const fallbackArtist = type === 'album' ? (details as any).artist : (details as any).owner;
                                const trackArtist = track.artist || fallbackArtist || "Aura Hi-Fi";
                                const filename = downloadManager.getSafeFilename(track.title, trackArtist);
                                
                                await downloadManager.deleteDownloadedFile(filename); 
                            }

                            Alert.alert("Completado", "La descarga ha sido eliminada.");

                            if (type === 'local_folder') {
                                navigation.goBack();
                            }

                        } catch (error) {
                            console.error("Error al eliminar la descarga:", error);
                            setIsDownloaded(true); 
                            Alert.alert("Error", "No se pudieron eliminar todos los archivos fisicos.");
                        }
                    }
                }
            ]
        );
    };

    const handlePlayTrack = (selectedTrack: any) => {
        if (!details || !details.tracks || details.tracks.length === 0) return;

        const normalizedTracks = details.tracks.map((t: any) => ({
            id: t.id,
            title: t.title,
            artist: t.artist,
            album: t.album || details.title,
            duration: t.duration,
            coverArtUrl: t.coverArtUrl || t.artwork || details.coverArtUrl,
            streamUrl: t.streamUrl || t.url 
        }));

        const normalizedSelected = normalizedTracks.find((t: any) => t.id === selectedTrack.id);
        
        if (normalizedSelected) {
            playerService.playCollection(normalizedSelected, normalizedTracks);
        }
    };

    const handlePlayAll = () => {
        if (details && details.tracks && details.tracks.length > 0) {
            handlePlayTrack(details.tracks[0]); 
        }
    };

    const handleShufflePlay = () => {
        if (filteredTracks.length === 0) return;
        
        const shuffledTracks = [...filteredTracks].sort(() => Math.random() - 0.5);
        
        playerService.playCollection(shuffledTracks[0], shuffledTracks);
    };

    const filteredTracks = useMemo(() => {
        if (!details?.tracks) return [];

        // 1. Filtro de Búsqueda
        let result = details.tracks.filter((track: any) => {
            const searchLower = searchQuery.toLowerCase();
            const safeTitle = String(track.title || '').toLowerCase();
            const safeArtist = String(track.artist || '').toLowerCase();
            return safeTitle.includes(searchLower) || safeArtist.includes(searchLower);
        });

        // 2. Ordenamiento
        if (currentSort === 'recent') {
            result = [...result].reverse();
        } else if (currentSort === 'title') {
            result = [...result].sort((a, b) => String(a.title).localeCompare(String(b.title)));
        } else if (currentSort === 'album') {
            result = [...result].sort((a, b) => String(a.album || '').localeCompare(String(b.album || '')));
        } else if (currentSort === 'artist') {
            result = [...result].sort((a, b) => {
                const artistCompare = String(a.artist || '').localeCompare(String(b.artist || ''));
                if (artistCompare !== 0) return artistCompare;
                return String(a.album || '').localeCompare(String(b.album || ''));
            });
        }
        return result;
    }, [details?.tracks, searchQuery, currentSort]); // <- React solo recalcula si estas 3 cosas cambian
    
    // --- RENDERIZADO ---
    
    if (isLoading || !details) {
        return (
            // 🚀 Usamos la imagen que nos mandó el Home/Library de inmediato
            <AuraBackground coverUrl={initialImageUrl}>
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={colors.accent} />
                </View>
            </AuraBackground>
        );
    }

    return (
        <AuraBackground coverUrl={details.coverArtUrl}>
            <View style={styles.container}>
                
                {/* 1. EL HEADER FIJO EN LA PARTE SUPERIOR */}
                <CollectionHeader 
                    onBack={() => navigation.goBack()} 
                    onOptions={() => setIsCollectionOptionsVisible(true)}
                />

                {/* 🚀 2. LA LISTA TURBO (Ya tiene su propio scroll y su Header interno) */}
                <CollectionTrackList 
                    listRef={flatListRef}
                    tracks={filteredTracks} 
                    onPlayTrack={handlePlayTrack} 
                    showCovers={isPlaylist}
                    isFromPlaylist={isPlaylist}
                    onRemoveFromPlaylist={async (trackId) => {
                        const originalIndex = details?.tracks?.findIndex((t: any) => t.id === trackId);
                        if (originalIndex === -1 || originalIndex === undefined) return;
                        try {
                            await PlaylistManagerService.removeTrackFromPlaylist(id, originalIndex);
                            setDetails((prevDetails: any) => {
                                if (!prevDetails) return prevDetails;
                                const newTracks = [...prevDetails.tracks];
                                newTracks.splice(originalIndex, 1); 
                                return { ...prevDetails, tracks: newTracks, songCount: Math.max(0, prevDetails.songCount - 1) };
                            });
                        } catch (error) {
                            Alert.alert("Error", "No se pudo eliminar la canción de la playlist.");
                        }
                    }}
                    // 🚀 AQUI VA TODO LO QUE ANTES ESTABA SUELTO ARRIBA
                    ListHeaderComponent={
                        <>
                            {type === 'playlist' && (
                                <View style={styles.searchBarContainer}> 
                                    <LocalSearchBar 
                                        searchQuery={searchQuery}
                                        onSearchChange={setSearchQuery}
                                        placeholder="Buscar en la playlist..."
                                    />
                                </View>
                            )}
                            
                            <CollectionCover coverArtUrl={details.coverArtUrl} />
                            
                            <View style={styles.flatTextBackground}>
                                <CollectionMetadata 
                                    title={details.title} 
                                    subtitle={details.artist || details.owner} 
                                />
                                
                                <CollectionActions 
                                    isLiked={isLiked}
                                    isDownloaded={isDownloaded}
                                    downloadProgress={downloadProgress}
                                    isPlaylist={isPlaylist}
                                    onAddSongs={() => setIsAddModalVisible(true)}
                                    onToggleLike={handleToggleLike}
                                    onDownload={handleDownload}
                                    onPlayAll={handlePlayAll}
                                    onShufflePlay={handleShufflePlay}
                                />
                            </View>
                        </>
                    }
                />
            </View>

            {/* 3. TODOS TUS MODALES SE QUEDAN EXACTAMENTE IGUAL */}
            <AddSongsModal 
                isVisible={isAddModalVisible}
                playlistId={id}
                onClose={() => setIsAddModalVisible(false)}
                onSuccess={() => {
                    Alert.alert("Aura Hi-Fi", "Canciones añadidas exitosamente");
                    loadData();
                }}
            />

            <CollectionOptionsModal
                isVisible={isCollectionOptionsVisible}
                onClose={() => setIsCollectionOptionsVisible(false)}
                title={details?.name || initialTitle || 'Coleccion'}
                subtitle={details?.songCount ? `${details.songCount} canciones` : 'Cargando...'}
                coverArtUrl={details?.coverArtUrl || details?.tracks?.[0]?.coverArtUrl}
                type={type}
                isPinned={isPinned}
                isDownloaded={isDownloaded}
                isAlbumSaved={isAlbumSaved}
                isInLibrary={false}
                onAddToQueue={async () => {
                    setIsCollectionOptionsVisible(false);
                    if (filteredTracks && filteredTracks.length > 0) {
                        try {
                            await playerService.addTracksToQueue(filteredTracks);
                            Alert.alert("Completado", `${filteredTracks.length} canciones añadidas a la fila.`);
                        } catch (error) {
                            Alert.alert("Error", "No se pudieron añadir las canciones a la fila.");
                        }
                    }
                }}
                onRemoveDownload={() => {
                    setIsCollectionOptionsVisible(false);
                    setTimeout(() => handleRemoveDownload(), 10);
                }}
                onStartJam={() => {
                    console.log("TODO: Empezar Jam");
                    setIsCollectionOptionsVisible(false);
                }}
                onTogglePin={() => {
                    setIsCollectionOptionsVisible(false);
                    handleTogglePin(); 
                }}
                onDeletePlaylist={() => {
                    setIsCollectionOptionsVisible(false);
                    Alert.alert(
                        "Eliminar Playlist",
                        "¿Estás seguro de que deseas eliminar esta playlist? Esta acción no se puede deshacer.",
                        [
                            { text: "Cancelar", style: "cancel" },
                            { 
                                text: "Eliminar", 
                                style: "destructive", 
                                onPress: async () => {
                                    try {
                                        await PlaylistManagerService.deletePlaylist(id);
                                        navigation.goBack();
                                    } catch (error) {
                                        Alert.alert("Error", "No se pudo eliminar la playlist.");
                                    }
                                }
                            }
                        ]
                    );
                }}
                onAddSongs={() => {
                    setIsCollectionOptionsVisible(false);
                    setTimeout(() => setIsAddModalVisible(true), 0);
                }}
                onEditMetadata={() => {
                    setIsCollectionOptionsVisible(false);
                    setTimeout(() => setIsEditModalVisible(true), 0);
                }}
                onChangeCover={() => {
                    console.log("TODO: Cambiar portada");
                    setIsCollectionOptionsVisible(false);
                }}
                onAutoSort={() => {
                    setIsCollectionOptionsVisible(false);
                    setTimeout(() => setIsSortModalVisible(true), 0);
                }}
                onToggleLibrary={() => {
                    setIsCollectionOptionsVisible(false);
                    setTimeout(() => handleToggleLibrary(), 0);
                }}
                onGoToArtist={() => {
                    setIsCollectionOptionsVisible(false);
                    const targetArtistId = details?.artistId || filteredTracks?.[0]?.artistId;
                    const targetArtistName = details?.artist || filteredTracks?.[0]?.artist || 'Artista';
                    if (targetArtistId) {
                        (navigation as any).navigate('ArtistDetail', {
                            id: targetArtistId,
                            name: targetArtistName
                        });
                    } else {
                        Alert.alert("Aviso", "No se encontró el perfil del artista para este álbum.");
                    }
                }}
                onCreateStation={async () => {
                    setIsCollectionOptionsVisible(false);
                    if (filteredTracks && filteredTracks.length > 0) {
                        try {
                            const seedTrack = filteredTracks[0];
                            let similarTracks = await navidromeApi.getSimilarSongs(seedTrack.id, 30);
                            if (!similarTracks || similarTracks.length === 0) {
                                similarTracks = await navidromeApi.getRandomSongs(30);
                            }
                            if (similarTracks.length > 0) {
                                const stationQueue = [seedTrack, ...similarTracks];
                                await playerService.playCollection(seedTrack, stationQueue);
                                Alert.alert("Estación Iniciada", `Radio en marcha.`);
                            }
                        } catch (error) {
                            Alert.alert("Error", "No se pudo iniciar la estación de radio.");
                        }
                    }
                }}
            />

            <EditPlaylistModal 
                isVisible={isEditModalVisible}
                playlistId={id}
                currentName={details?.title || details?.name || initialTitle || ''}
                onClose={() => setIsEditModalVisible(false)}
                onSuccess={(newName) => {
                    setDetails((prev: any) => ({ ...prev, title: newName, name: newName }));
                    Alert.alert("Éxito", "Playlist renombrada correctamente.");
                }}
            />

            <SortOptionsModal 
                isVisible={isSortModalVisible}
                currentSort={currentSort}
                onClose={() => setIsSortModalVisible(false)}
                onSelectSort={async (newSort) => {
                    setCurrentSort(newSort);
                    try {
                        await AsyncStorage.setItem(`@sort_pref_${id}`, newSort);
                    } catch (error) {
                        console.log("No se pudo guardar la preferencia de orden", error);
                    }
                }}
            />
        </AuraBackground>
    );
}