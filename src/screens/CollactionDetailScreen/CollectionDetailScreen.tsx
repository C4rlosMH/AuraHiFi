import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- Servicios ---
import { navidromeApi } from '../../services/navidromeApi';
import { pinService, PinItem } from '../../services/PinService';
// import { playerService } from '../../services/PlayerService'; // Lo usaremos para reproducir

// --- Estilos ---
import { styles } from './CollectionDetailScreen.styles';
import { colors } from '../../styles/theme';

export default function CollectionDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    
    // Asumimos que al navegar le pasamos el ID y el TIPO (album o playlist)
    const { id, type, title: initialTitle } = route.params as { id: string, type: 'album' | 'playlist', title: string };

    const [details, setDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPinned, setIsPinned] = useState(false);
    const [isLiked, setIsLiked] = useState(false); // Estado para el corazón (Navidrome)

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            
            // 1. Cargamos datos del NAS
            const data = type === 'album' 
                ? await navidromeApi.getAlbumDetails(id)
                : await navidromeApi.getPlaylistDetails(id);
            
            setDetails(data);

            // 2. Verificamos si ya está Pineado localmente
            const pinnedStatus = await pinService.isPinned(id);
            setIsPinned(pinnedStatus);
            
            // Nota: Aquí en el futuro verificarías si el álbum completo tiene 'Like' en Navidrome
            // setIsLiked(data.starred); 
            
        } catch (error) {
            console.error("Error cargando detalles:", error);
            Alert.alert("Error", "No se pudo cargar la colección.");
            navigation.goBack();
        } finally {
            setIsLoading(false);
        }
    };

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
            // ¡El usuario intentó pinear un 7mo disco!
            Alert.alert("Biblioteca Llena", result.message);
        }
    };

    const handleToggleLike = async () => {
        // Esto envía la orden a Navidrome para guardarlo globalmente
        const newState = await navidromeApi.toggleStar(id, isLiked);
        setIsLiked(newState);
    };

    if (isLoading || !details) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                
                {/* --- PORTADA GIGANTE Y GRADIENTE --- */}
                <View style={styles.coverContainer}>
                    <Image source={{ uri: details.coverArtUrl }} style={styles.coverImage} />
                    <View style={styles.gradientOverlay}>
                        <Text style={styles.title} numberOfLines={2}>{details.title}</Text>
                        <Text style={styles.subtitle}>{details.artist || details.owner}</Text>
                    </View>
                </View>

                {/* --- BARRA DE ACCIONES (FROSTED & MAIN) --- */}
                <View style={styles.actionRow}>
                    <View style={styles.leftActions}>
                        {/* Botón de Like (Nube/Navidrome) */}
                        <TouchableOpacity style={styles.iconButton} onPress={handleToggleLike}>
                            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={22} color={isLiked ? colors.accent : colors.primary} />
                        </TouchableOpacity>

                        {/* Botón de Pin (Local/Aura Hi-Fi) */}
                        <TouchableOpacity style={styles.iconButton} onPress={handleTogglePin}>
                            <Ionicons name={isPinned ? "pin" : "pin-outline"} size={22} color={isPinned ? colors.accent : colors.primary} />
                        </TouchableOpacity>
                    </View>

                    {/* Botón Play */}
                    <TouchableOpacity style={styles.playButton} onPress={() => console.log("Play All")}>
                        <Ionicons name="play" size={26} color="#000" style={{ marginLeft: 3 }} />
                    </TouchableOpacity>
                </View>

                {/* --- LISTA DE CANCIONES --- */}
                <View style={styles.trackListContainer}>
                    {details.tracks.map((track: any, index: number) => (
                        <TouchableOpacity key={track.id} style={styles.trackRow} onPress={() => console.log("Play Track", track.title)}>
                            <Text style={styles.trackNumber}>{index + 1}</Text>
                            <View style={styles.trackInfo}>
                                <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
                                <Text style={styles.trackArtist} numberOfLines={1}>{track.artist}</Text>
                            </View>
                            <Ionicons name="ellipsis-vertical" size={20} color={colors.textMuted} />
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>
        </View>
    );
}