import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, TouchableWithoutFeedback, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { Track } from '../../../services/navidromeApi';
import { playerService } from '../../../services/PlayerService';
import { downloadManager } from '../../../services/downloadManager';
import { PlaylistManagerService } from '../../../services/PlaylistManagerService';
import { localLibraryService } from '../../../services/LocalLibraryService';
import { styles } from './TrackOptionsModal.styles';

//import AddToPlaylistModal from '../AddToPlaylistModal/AddToPlaylistModal';

interface TrackOptionsModalProps {
    isVisible: boolean;
    track: Track | null;
    onClose: () => void;
    isFromPlaylist?: boolean; 
    isFromAlbum?: boolean;
    onRemoveFromPlaylist?: (trackId: string) => void;
    onAddToPlaylist?: (trackId: string) => void; // 🚀 Nueva prop para el futuro selector
}

export default function TrackOptionsModal({ 
    isVisible, 
    track, 
    onClose, 
    isFromPlaylist = false,
    isFromAlbum = false,
    onRemoveFromPlaylist,
    onAddToPlaylist 
}: TrackOptionsModalProps) {
    const navigation = useNavigation<any>();
    const [isStarred, setIsStarred] = useState(false);
    //const [isPlaylistModalVisible, setIsPlaylistModalVisible] = useState(false);

    useEffect(() => {
        if (track) {
            // 1. Le creemos al servidor primero
            const serverState = track.starred || false;
            setIsStarred(serverState);
            
            // 2. 🚀 Verificamos en la base local para que no haya margen de error
            localLibraryService.isTrackFavorited(track.id).then((isLocalFav) => {
                if (isLocalFav || serverState) {
                    setIsStarred(true);
                }
            });
        }
    }, [track]);

    if (!track) return null;

    const displayImage = track.coverArtUrl || (track as any).artwork || (track as any).imageUrl;

    const handlePlayNext = async () => {
        try {
            await playerService.playNext(track);
            onClose();
        } catch (error) {
            console.error("Error al añadir a continuación:", error);
        }
    };

    const handleAddToQueue = async () => {
        try {
            await playerService.appendToQueue(track);
            onClose();
        } catch (error) {
            console.error("Error al añadir al final:", error);
        }
    };

    const handleGoToArtist = () => {
        onClose();
        // 🚀 CORRECCIÓN: Buscamos el ID real, si no existe, mandamos el nombre para la "Búsqueda Fantasma"
        const artistId = (track as any).artistId || track.artist;
        if (artistId) {
            navigation.navigate('ArtistDetail', { id: artistId, name: track.artist });
        } else {
            Alert.alert("Aviso", "No se encontró información del artista.");
        }
    };

    const handleGoToAlbum = () => {
        onClose();
        // 🚀 CORRECCIÓN: Obligamos a usar el ID real del álbum
        const albumId = (track as any).albumId;
        if (albumId) {
            navigation.navigate('CollectionDetail', { id: albumId, type: 'album', title: track.album });
        } else {
             Alert.alert("Aviso", "Esta pista no tiene un álbum asociado.");
        }
    };

    const handleToggleFavorite = async () => {
        const newState = !isStarred;
        setIsStarred(newState); // UI Optimista
        
        try {
            // Sincronizamos NAS + Local (igual que en el reproductor)
            await playerService.toggleFavoriteServer(track.id);
            await localLibraryService.handleTrackLike(track as any);
        } catch (error) {
            setIsStarred(!newState);
            Alert.alert("Error de red", "No se pudo sincronizar el favorito.");
        }
    };

    const handleDownload = async () => {
        onClose();
        try {
            // 🚀 NUEVO: Conectado a tus managers reales
            const localUri = await downloadManager.downloadTrack(track.streamUrl, track.title, track.artist);
            await localLibraryService.registerDownload(track as any, localUri);
            Alert.alert("Descarga Completada", `"${track.title}" se guardó offline.`);
        } catch (error) {
            console.error("Error descargando pista:", error);
            Alert.alert("Error", "No se pudo descargar la canción.");
        }
    };

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    
                    <TouchableWithoutFeedback>
                        <View style={styles.bottomSheet}>
                            
                            <View style={styles.dragHandleContainer}>
                                <View style={styles.dragHandle} />
                            </View>

                            <View style={styles.headerContainer}>
                                {displayImage ? (
                                    <Image source={{ uri: displayImage }} style={styles.coverArt} />
                                ) : (
                                    <View style={styles.coverArtPlaceholder}>
                                        <Ionicons name="musical-notes" size={24} style={styles.placeholderIcon} />
                                    </View>
                                )}
                                <View style={styles.headerTextContainer}>
                                    <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
                                    <Text style={styles.trackArtist} numberOfLines={1}>{track.artist}</Text>
                                </View>
                            </View>

                            {/* --- LISTA DE OPCIONES --- */}
                            <TouchableOpacity style={styles.optionRow} onPress={handlePlayNext}>
                                <Ionicons name="return-down-forward" size={24} style={styles.optionIcon} />
                                <Text style={styles.optionText}>Reproducir a continuación</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.optionRow} onPress={handleAddToQueue}>
                                <Ionicons name="list-circle-outline" size={24} style={styles.optionIcon} />
                                <Text style={styles.optionText}>Añadir a la fila</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.optionRow} onPress={handleDownload}>
                                <Ionicons name="download-outline" size={24} style={styles.optionIcon} />
                                <Text style={styles.optionText}>Descargar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.optionRow} onPress={() => {
                                onClose();
                                onAddToPlaylist?.(track.id);
                                }}>
                                    <Ionicons name="add-circle-outline" size={24} style={styles.optionIcon} />
                                    <Text style={styles.optionText}>Añadir a una playlist</Text>
                            </TouchableOpacity>

                            {!isFromAlbum && (
                                <TouchableOpacity style={styles.optionRow} onPress={handleGoToAlbum}>
                                    <Ionicons name="disc-outline" size={24} style={styles.optionIcon} />
                                    <Text style={styles.optionText}>Ver álbum</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity style={styles.optionRow} onPress={handleGoToArtist}>
                                <Ionicons name="person-outline" size={24} style={styles.optionIcon} />
                                <Text style={styles.optionText}>Ir al artista</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.optionRow} onPress={handleToggleFavorite}>
                                <Ionicons 
                                    name={isStarred ? "heart" : "heart-outline"} 
                                    size={24} 
                                    style={isStarred ? styles.favoriteIconActive : styles.optionIcon} 
                                />
                                <Text style={styles.optionText}>{isStarred ? "Eliminar de favoritos" : "Añadir a favoritos"}</Text>
                            </TouchableOpacity>

                            {isFromPlaylist && onRemoveFromPlaylist && (
                                <TouchableOpacity 
                                    style={styles.optionRow} 
                                    onPress={() => { onRemoveFromPlaylist(track.id); onClose(); }}
                                >
                                    <Ionicons name="trash-outline" size={24} style={styles.dangerIcon} />
                                    <Text style={[styles.optionText, styles.optionTextDanger]}>Eliminar de la playlist</Text>
                                </TouchableOpacity>
                            )}

                        </View>
                    </TouchableWithoutFeedback>

                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}