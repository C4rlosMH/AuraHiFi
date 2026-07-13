import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Servicios ---
import { navidromeApi } from '../../services/navidromeApi';
import { pinService, PinItem } from '../../services/PinService';
import { playerService } from '../../services/PlayerService'; // Lo usaremos para reproducir
import { downloadManager } from '../../services/downloadManager'
import { localLibraryService } from '../../services/LocalLibraryService';
import { PlaylistManagerService } from '../../services/PlaylistManagerService';

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
    
    // Obtenemos los parámetros de navegación

    const { id, type, title: initialTitle } = route.params as { id: string, type: 'album' | 'playlist' | 'local_folder', title: string };

    // --- ESTADOS ---
    const [details, setDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPinned, setIsPinned] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [downloadProgress, setDownloadProgress] = useState<string | null>(null);
    const isPlaylist = type === 'playlist';
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isCollectionOptionsVisible, setIsCollectionOptionsVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
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
        if (!isLoading && type === 'playlist' && scrollViewRef.current) {
            // Le damos 150ms a Android para asegurar que la vista ya existe antes de moverla
            setTimeout(() => {
                // 90 es la altura de la barra + el margen del Notch de tu Poco X7 Pro
                scrollViewRef.current?.scrollTo({ y: 90, animated: false });
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

            // C. Verificamos si esta descargado usando tu downloadManager
            if (data.tracks && data.tracks.length > 0) {
                const firstTrack = data.tracks[0];
                
                // Evaluamos si es album (tiene artist) o playlist (tiene owner) para evitar el error de TypeScript
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

        // Bloqueamos el pin para carpetas locales (ya son permanentes en la biblioteca)
        if (type === 'local_folder') {
            Alert.alert("Carpetas Locales", "Estas carpetas ya forman parte permanente de tu biblioteca.");
            return;
        }
        
        const pinData: PinItem = {
            id: details.id,
            title: details.title,
            subtitle: details.artist || details.owner || 'Aura Hi-Fi',
            coverArtUrl: details.coverArtUrl,
            // Hacemos un "Type Assertion" para calmar a TypeScript
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
        // Navidrome (Subsonic) no tiene soporte nativo para dar like a Playlists
        if (type === 'playlist') {
            Alert.alert("Aviso", "Navidrome no permite guardar playlists enteras en favoritos, solo álbumes o canciones.");
            return;
        }

        try {
            // 🚀 Le indicamos explícitamente a la API que es un 'album'
            const newState = await navidromeApi.toggleStar(id, isLiked, 'album');
            setIsLiked(newState);
        } catch (error) {
            console.log("Toggle Star falló", error);
        }
    };

    const handleDownload = async () => {
        if (!details || !details.tracks || details.tracks.length === 0) return;

        try {
            setIsDownloaded(true); 
            setDownloadProgress("0%");

            // Normalizamos las pistas
            const tracksToProcess = details.tracks.map((t: any) => ({
                id: t.id,
                title: t.title,
                artist: t.artist || details.artist || "Aura Hi-Fi",
                album: t.album || details.title,
                duration: t.duration,
                coverArtUrl: t.coverArtUrl || details.coverArtUrl,
                streamUrl: t.streamUrl || t.url
            }));

            // 1. Descarga física (Sandbox)
            await downloadManager.downloadCollection(tracksToProcess, (downloaded, total) => {
                const percentage = Math.round((downloaded / total) * 100);
                setDownloadProgress(`${percentage}%`);
            });

            // 🚀 2. NUEVO: Registro en la Base de Datos Local
            console.log("Registrando pistas en la biblioteca offline...");
            for (const track of tracksToProcess) {
                const filename = downloadManager.getSafeFilename(track.title, track.artist);
                const localUri = await downloadManager.getLocalUriIfExists(filename);
                
                if (localUri) {
                    await localLibraryService.registerDownload(track, localUri);
                }
            }

            setDownloadProgress(null);
            Alert.alert("Descarga Completada", "La colección ha sido guardada y catalogada en tu dispositivo.");

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
            "¿Estás seguro de que deseas eliminar este contenido de tu dispositivo? Necesitarás conexión a internet para volver a escucharlo.",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            // 1. UI Optimista: Cambiamos el estado al instante
                            setIsDownloaded(false);
                            
                            // 2. Procesamos canción por canción
                            for (const track of details.tracks) {
                                // A. Borramos el registro de tu base de datos local
                                await localLibraryService.removeDownloadedTrack(track.id);
                                
                                // B. Borramos el archivo físico usando tu downloadManager
                                const fallbackArtist = type === 'album' ? (details as any).artist : (details as any).owner;
                                const trackArtist = track.artist || fallbackArtist || "Aura Hi-Fi";
                                const filename = downloadManager.getSafeFilename(track.title, trackArtist);
                                
                                // (Asegúrate de tener un método para borrar archivos en tu downloadManager)
                                await downloadManager.deleteDownloadedFile(filename); 
                            }

                            Alert.alert("Completado", "La descarga ha sido eliminada.");

                            // 🚀 Extra: Si el usuario borra algo mientras está dentro de la carpeta local, lo sacamos de ahí para evitar un crasheo visual
                            if (type === 'local_folder') {
                                navigation.goBack();
                            }

                        } catch (error) {
                            console.error("Error al eliminar la descarga:", error);
                            setIsDownloaded(true); // Revertimos el icono si algo falla
                            Alert.alert("Error", "No se pudieron eliminar todos los archivos físicos.");
                        }
                    }
                }
            ]
        );
    };

    const handlePlayTrack = (selectedTrack: any) => {
        if (!details || !details.tracks || details.tracks.length === 0) return;

        // Normalizador Crítico: Asegura que playerService entienda las URLs del NAS
        const normalizedTracks = details.tracks.map((t: any) => ({
            id: t.id,
            title: t.title,
            artist: t.artist,
            album: t.album || details.title,
            duration: t.duration,
            coverArtUrl: t.coverArtUrl || t.artwork || details.coverArtUrl,
            streamUrl: t.streamUrl || t.url // Emparejamos el tipo de URL
        }));

        const normalizedSelected = normalizedTracks.find((t: any) => t.id === selectedTrack.id);
        
        if (normalizedSelected) {
            playerService.playCollection(normalizedSelected, normalizedTracks);
        }
    };

    const handlePlayAll = () => {
        if (details && details.tracks && details.tracks.length > 0) {
            handlePlayTrack(details.tracks[0]); // Reproduce desde la pista 1
        }
    };

    const handleShufflePlay = () => {
    if (filteredTracks.length === 0) return;
    
    // Hacemos una copia de las canciones y las mezclamos aleatoriamente
    const shuffledTracks = [...filteredTracks].sort(() => Math.random() - 0.5);
    
    // Le mandamos la primera canción de la nueva lista y la lista completa mezclada
    playerService.playCollection(shuffledTracks[0], shuffledTracks);
};

    // 🚀 PASO 1: EL FILTRO DE BÚSQUEDA (Tu código original intacto)
    // Usamos 'let' en lugar de 'const' para poder reordenarlo en el paso 2
    let filteredTracks = details?.tracks?.filter((track: any) => {
        const searchLower = searchQuery.toLowerCase();
        
        // 🛡️ ESCUDO: Convertimos forzosamente a String
        const safeTitle = String(track.title || '').toLowerCase();
        const safeArtist = String(track.artist || '').toLowerCase();

        return safeTitle.includes(searchLower) || safeArtist.includes(searchLower);
    }) || [];

    // 🚀 PASO 2: EL ORDENAMIENTO (La nueva función)
    // Tomamos el resultado de tu búsqueda y lo acomodamos
    if (currentSort === 'recent') {
        // En las playlists de Navidrome, el final de la lista son las más nuevas. 
        // Con reverse() las mandamos al principio.
        filteredTracks = [...filteredTracks].reverse();
    } else if (currentSort === 'title') {
        filteredTracks = [...filteredTracks].sort((a, b) => String(a.title).localeCompare(String(b.title)));
    } else if (currentSort === 'album') {
        filteredTracks = [...filteredTracks].sort((a, b) => {
            const albumA = String(a.album || '');
            const albumB = String(b.album || '');
            return albumA.localeCompare(albumB);
        });
    } else if (currentSort === 'artist') {
        filteredTracks = [...filteredTracks].sort((a, b) => {
            const artistA = String(a.artist || '');
            const artistB = String(b.artist || '');
            // Nivel 1: Por Artista
            const artistCompare = artistA.localeCompare(artistB);
            if (artistCompare !== 0) return artistCompare;
            
            // Nivel 2: Por Álbum (si es el mismo artista)
            const albumA = String(a.album || '');
            const albumB = String(b.album || '');
            return albumA.localeCompare(albumB);
        });
    }
    // Si currentSort es 'custom', no entra a ningún if y se queda con el orden del servidor.
    // --- RENDERIZADO ---
    
    // Pantalla de Carga
    if (isLoading || !details) {
        return (
            <AuraBackground>
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={colors.accent} />
                </View>
            </AuraBackground>
        );
    }

    // Interfaz Principal Ensamblada
    return (
        <AuraBackground coverUrl={details.coverArtUrl}>
            <View style={styles.container}>
                
                {/* 1. Header con efecto Frosted (Flotante) */}
                <CollectionHeader 
                    onBack={() => navigation.goBack()} 
                    onOptions={() => setIsCollectionOptionsVisible(true)}
                />

                {/* 2. Cuerpo Deslizable */}
                <ScrollView 
                    ref={scrollViewRef} // 🚀 Conectamos el control manual
                    showsVerticalScrollIndicator={false}
                    /* style={{ backgroundColor: 'transparent' }}  */
                    // Eliminamos el contentOffset que Android ignora
                >
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

                    <CollectionTrackList 
                        tracks={filteredTracks} 
                        onPlayTrack={handlePlayTrack} 
                        showCovers={isPlaylist}
                        isFromPlaylist={isPlaylist}
                        onRemoveFromPlaylist={async (trackId) => {
                            // 1. Buscamos el índice original (Navidrome necesita la posición exacta)
                            const originalIndex = details?.tracks?.findIndex((t: any) => t.id === trackId);
                            
                            if (originalIndex === -1 || originalIndex === undefined) return;

                            try {
                                // 2. Borramos en el servidor
                                await PlaylistManagerService.removeTrackFromPlaylist(id, originalIndex);
                                
                                // 3. UI Optimista (Forzada): Creamos un clon exacto para obligar a React a redibujar
                                setDetails((prevDetails: any) => {
                                    if (!prevDetails) return prevDetails;
                                    
                                    const newTracks = [...prevDetails.tracks];
                                    newTracks.splice(originalIndex, 1); // Cortamos la canción exacta
                                    
                                    return {
                                        ...prevDetails,
                                        tracks: newTracks,
                                        songCount: Math.max(0, prevDetails.songCount - 1)
                                    };
                                });
                                
                            } catch (error) {
                                Alert.alert("Error", "No se pudo eliminar la canción de la playlist.");
                            }
                        }}
                    />

                </ScrollView>
            </View>
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
                title={details?.name || initialTitle || 'Colección'}
                subtitle={details?.songCount ? `${details.songCount} canciones` : 'Cargando...'}
                coverArtUrl={details?.coverArtUrl || details?.tracks?.[0]?.coverArtUrl}
                type={type}
                
                // Estados (Pronto los conectaremos a tu lógica)
                isPinned={isPinned}
                //isDownloaded={false}
                isDownloaded={isDownloaded} // Pasamos el estado real
                isInLibrary={false}

                // Callbacks compartidos
                onAddToQueue={async () => {
                    setIsCollectionOptionsVisible(false);
                    // Validamos que haya canciones cargadas en la pantalla
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
                    // Damos 300ms para que se cierre el modal antes de lanzar la Alerta nativa
                    setTimeout(() => handleRemoveDownload(), 300);
                }}
                onStartJam={() => {
                    console.log("TODO: Empezar Jam");
                    setIsCollectionOptionsVisible(false);
                }}

                // Callbacks de Playlist
                onTogglePin={() => {
                    setIsCollectionOptionsVisible(false); // Cerramos el modal
                    handleTogglePin(); // 🚀 EJECUTAMOS TU FUNCIÓN EXISTENTE
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
                                        // Usamos tu servicio existente y el 'id' de los params
                                        await PlaylistManagerService.deletePlaylist(id);
                                        // Regresamos a la pantalla anterior
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
                    // 🚀 Le damos 300ms de respiro para que el menú inferior se cierre 
                    // antes de abrir el modal central y evitar choques visuales
                    setTimeout(() => setIsAddModalVisible(true), 300);
                }}
                onEditMetadata={() => {
                    setIsCollectionOptionsVisible(false);
                    // Le damos un respiro de 300ms a la pantalla para cerrar el menú inferior y abrir el centro
                    setTimeout(() => setIsEditModalVisible(true), 300);
                }}
                onChangeCover={() => {
                    console.log("TODO: Cambiar portada");
                    setIsCollectionOptionsVisible(false);
                }}
                onAutoSort={() => {
                    setIsCollectionOptionsVisible(false);
                    setTimeout(() => setIsSortModalVisible(true), 100);
                }}

                // Callbacks de Álbum
                onToggleLibrary={() => {
                    console.log("TODO: Añadir/Eliminar de biblioteca");
                    setIsCollectionOptionsVisible(false);
                }}
                onGoToArtist={() => {
                    setIsCollectionOptionsVisible(false);
                    
                    // 🚀 Buscamos el ID en el álbum, o como plan B, en la primera canción
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
                            
                            // 🚀 PLAN B: Si Navidrome no sabe qué recomendar, simulamos la radio con canciones aleatorias
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
                    // UI Optimista: Actualizamos el título sin recargar la API
                    setDetails((prev: any) => ({ ...prev, title: newName, name: newName }));
                    // Opcional: Mostramos una pequeña alerta de éxito
                    Alert.alert("Éxito", "Playlist renombrada correctamente.");
                }}
            />
            <SortOptionsModal 
                isVisible={isSortModalVisible}
                currentSort={currentSort}
                onClose={() => setIsSortModalVisible(false)}
                onSelectSort={async (newSort) => {
                    // 1. Lo aplicamos visualmente al instante
                    setCurrentSort(newSort);
                    
                    // 2. Lo guardamos en el disco duro del teléfono para siempre
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