import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

// --- Servicios ---
import { navidromeApi } from '../../services/navidromeApi';
import { pinService, PinItem } from '../../services/PinService';
import { playerService } from '../../services/PlayerService'; // Lo usaremos para reproducir

// --- Componentes ---
import AuraBackground from '../../components/AuraBackground/AuraBackground';
import CollectionHeader from '../../components/CollectionDetail/Header/CollectionHeader';
import CollectionCover from '../../components/CollectionDetail/Cover/CollectionCover';
import CollectionMetadata from '../../components/CollectionDetail/Metadata/CollectionMetadata';
import CollectionActions from '../../components/CollectionDetail/Actions/CollectionActions';
import CollectionTrackList from '../../components/CollectionDetail/TrackList/CollectionTrackList';

// --- Estilos ---
import { styles } from './CollectionDetailScreen.styles';
import { colors } from '../../styles/theme';

export default function CollectionDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    
    // Obtenemos los parámetros de navegación
    const { id, type, title: initialTitle } = route.params as { id: string, type: 'album' | 'playlist', title: string };

    // --- ESTADOS ---
    const [details, setDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPinned, setIsPinned] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isDownloaded, setIsDownloaded] = useState(false);

    // --- EFECTO DE CARGA INICIAL ---
    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            // 1. Cargamos la info del NAS dependiendo de si es álbum o playlist
            const data = type === 'album' 
                ? await navidromeApi.getAlbumDetails(id)
                : await navidromeApi.getPlaylistDetails(id);
            
            setDetails(data);

            // 2. Verificamos si ya está guardado en el PinService local
            const pinnedStatus = await pinService.isPinned(id);
            setIsPinned(pinnedStatus);
            
            // Aquí a futuro agregaremos la validación de descargas (expo-file-system)
            
        } catch (error) {
            console.error("Error cargando detalles:", error);
            Alert.alert("Error de conexión", "No se pudo cargar la colección desde el NAS.");
            navigation.goBack();
        } finally {
            setIsLoading(false);
        }
    };

    // --- FUNCIONES CONTROLADORAS ---
    const handleTogglePin = async () => {
        if (!details) return;
        
        const pinData: PinItem = {
            id: details.id,
            title: details.title,
            subtitle: details.artist || details.owner || 'Aura Hi-Fi',
            coverArtUrl: details.coverArtUrl,
            type: type
        };

        const result = await pinService.togglePin(pinData);
        if (result.success) {
            setIsPinned(!isPinned);
        } else {
            Alert.alert("Biblioteca Llena", result.message);
        }
    };

    const handleToggleLike = async () => {
        // Aún falta implementar el método toggleStar en NavidromeAPI, 
        // pero dejamos la lógica lista.
        try {
            const newState = await navidromeApi.toggleStar(id, isLiked);
            setIsLiked(newState);
        } catch (error) {
            console.log("Toggle Star falló", error);
        }
    };

    const handleDownload = () => {
        // Simulador de descarga para la UI por ahora
        console.log("Iniciando preparación de FLACs para descarga offline...");
        setIsDownloaded(!isDownloaded);
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
                    showsVerticalScrollIndicator={false}
                    style={{ backgroundColor: 'transparent' }} 
                >
                    
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
                            onToggleLike={handleToggleLike}
                            onTogglePin={handleTogglePin}
                            onDownload={handleDownload}
                            onPlayAll={handlePlayAll}
                        />
                    </View>

                    <CollectionTrackList 
                        tracks={details.tracks} 
                        onPlayTrack={handlePlayTrack} 
                    />

                </ScrollView>
            </View>
        </AuraBackground>
    );
}