import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, TouchableWithoutFeedback, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { Track } from '../../../services/navidromeApi';
import { playerService } from '../../../services/PlayerService';
import { styles } from './TrackOptionsModal.styles';

interface TrackOptionsModalProps {
    isVisible: boolean;
    track: Track | null;
    onClose: () => void;
    isFromPlaylist?: boolean; 
    isFromAlbum?: boolean;
    onRemoveFromPlaylist?: (trackId: string) => void;
}

export default function TrackOptionsModal({ 
    isVisible, 
    track, 
    onClose, 
    isFromPlaylist = false,
    isFromAlbum = false,
    onRemoveFromPlaylist 
}: TrackOptionsModalProps) {
    const navigation = useNavigation<any>();

    const [isStarred, setIsStarred] = useState(false);

    useEffect(() => {
        if (track) {
            setIsStarred(track.starred || false);
        }
    }, [track]);

    if (!track) return null;

    // 🚀 CAZADOR DE IMÁGENES: Busca la portada en todas las posibles propiedades del objeto
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
        if (track.artist) {
            navigation.navigate('ArtistDetail', { id: track.artist, name: track.artist });
        } else {
            Alert.alert("Aviso", "No se encontró el ID del artista.");
        }
    };

    const handleGoToAlbum = () => {
        onClose();
        if (track.album) {
            navigation.navigate('CollectionDetail', { id: track.album, type: 'album', title: track.album });
        } else {
             Alert.alert("Aviso", "No se encontró el ID del álbum.");
        }
    };

    const handleToggleFavorite = async () => {
        // UI Optimista: Cambiamos la interfaz instantáneamente para que el usuario lo sienta rápido
        const newState = !isStarred;
        setIsStarred(newState);
        
        try {
            await playerService.toggleFavoriteServer(track.id);
            // Nota: No cerramos el modal aquí para que el usuario disfrute ver cómo se enciende el corazón.
        } catch (error) {
            // Si el servidor falla, revertimos el botón
            setIsStarred(!newState);
            Alert.alert("Error de red", "No se pudo sincronizar el favorito con Navidrome.");
        }
    };

    const handleDownload = () => {
        onClose();
        Alert.alert(
            "Descarga Iniciada", 
            `Descargando "${track.title}" en formato FLAC para escucha offline...`
        );
        // TODO: Aquí conectaremos expo-file-system en el Backlog Punto 6
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
                                <Text style={styles.optionText}>Añadir al final de la cola</Text>
                            </TouchableOpacity>

                            {/* 🚀 NUEVO: Botón de Descarga */}
                            <TouchableOpacity style={styles.optionRow} onPress={handleDownload}>
                                <Ionicons name="download-outline" size={24} style={styles.optionIcon} />
                                <Text style={styles.optionText}>Descargar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.optionRow} onPress={() => { console.log("Añadir a playlist"); onClose(); }}>
                                <Ionicons name="add-circle-outline" size={24} style={styles.optionIcon} />
                                <Text style={styles.optionText}>Añadir a una playlist</Text>
                            </TouchableOpacity>

                            {/* 🚀 LÓGICA CONDICIONAL: Oculta el botón si ya estás en la vista del álbum */}
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

                            {/* 🚀 BOTÓN FAVORITO REACTIVO */}
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