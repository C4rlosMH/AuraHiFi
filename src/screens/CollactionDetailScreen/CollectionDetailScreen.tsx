import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

// --- Servicios ---
import { navidromeApi } from '../../services/navidromeApi';
import { pinService, PinItem } from '../../services/PinService';
import { playerService } from '../../services/PlayerService'; // Lo usaremos para reproducir
import { downloadManager } from '../../services/downloadManager'
import { localLibraryService } from '../../services/LocalLibraryService';

// --- Componentes ---
import AuraBackground from '../../components/AuraBackground/AuraBackground';
import CollectionHeader from '../../components/CollectionDetail/Header/CollectionHeader';
import CollectionCover from '../../components/CollectionDetail/Cover/CollectionCover';
import CollectionMetadata from '../../components/CollectionDetail/Metadata/CollectionMetadata';
import CollectionActions from '../../components/CollectionDetail/Actions/CollectionActions';
import CollectionTrackList from '../../components/CollectionDetail/TrackList/CollectionTrackList';
import LocalSearchBar from '../../components/Common/LocalSearchBar/LocalSearchBar';
import AddSongsModal from '../../components/CollectionDetail/AddSongsModal/AddSongsModal';


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

    const scrollViewRef = useRef<ScrollView>(null);

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

    const filteredTracks = details?.tracks?.filter((track: any) => {
        const searchLower = searchQuery.toLowerCase();
        
        // 🛡️ ESCUDO: Convertimos forzosamente a String para evitar que 
        // Navidrome o TypeScript nos rompan el código con booleanos (false) o nulos
        const safeTitle = String(track.title || '').toLowerCase();
        const safeArtist = String(track.artist || '').toLowerCase();

        return safeTitle.includes(searchLower) || safeArtist.includes(searchLower);
    }) || [];

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
                    onOptions={() => console.log("Opciones de colección abiertas")} 
                />

                {/* 2. Cuerpo Deslizable */}
                <ScrollView 
                    ref={scrollViewRef} // 🚀 Conectamos el control manual
                    showsVerticalScrollIndicator={false}
                    style={{ backgroundColor: 'transparent' }} 
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
                            isPinned={isPinned}
                            isDownloaded={isDownloaded}
                            downloadProgress={downloadProgress}
                            isPlaylist={isPlaylist}
                            onAddSongs={() => setIsAddModalVisible(true)}
                            onToggleLike={handleToggleLike}
                            onTogglePin={handleTogglePin}
                            onDownload={handleDownload}
                            onPlayAll={handlePlayAll}
                            onShufflePlay={handleShufflePlay}
                        />
                    </View>

                    <CollectionTrackList 
                        tracks={filteredTracks} 
                        onPlayTrack={handlePlayTrack} 
                        showCovers={isPlaylist}
                        // 🚀 AQUÍ LE DECIMOS QUE SÍ ESTAMOS EN UNA PLAYLIST
                        isFromPlaylist={isPlaylist}
                        // 🚀 PREPARAMOS LA FUNCIÓN DE BORRADO (La lógica real la haremos después)
                        onRemoveFromPlaylist={(trackId) => {
                            console.log("Eliminar pista:", trackId);
                            // TODO: Conectar con navidromeApi para borrar
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
        </AuraBackground>
    );
}