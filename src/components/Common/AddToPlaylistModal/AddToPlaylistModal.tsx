import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, TouchableWithoutFeedback, FlatList, ActivityIndicator, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { navidromeApi, Playlist } from '../../../services/navidromeApi';
import { PlaylistManagerService } from '../../../services/PlaylistManagerService';
import { styles } from './AddToPlaylistModal.styles';
import { colors } from '../../../styles/theme';

interface AddToPlaylistModalProps {
    isVisible: boolean;
    trackId: string | null;
    onClose: () => void;
}

export default function AddToPlaylistModal({ isVisible, trackId, onClose }: AddToPlaylistModalProps) {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (isVisible) {
            loadPlaylists();
        } else {
            // Limpiamos el estado al cerrar para que no parpadee al volver a abrir
            setPlaylists([]);
            setIsLoading(true);
            setIsProcessing(false);
        }
    }, [isVisible]);

    const loadPlaylists = async () => {
        try {
            setIsLoading(true);
            const data = await navidromeApi.getPlaylists();
            setPlaylists(data);
        } catch (error) {
            console.error("Error al cargar playlists para el modal:", error);
            Alert.alert("Error", "No se pudieron cargar tus playlists.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectPlaylist = async (playlistId: string) => {
        if (!trackId || isProcessing) return;

        try {
            setIsProcessing(true);
            // 🚀 USANDO TU SERVICIO PROFESIONAL
            await PlaylistManagerService.addTracksToPlaylist(playlistId, [trackId]);
            Alert.alert("Completado", "Canción agregada exitosamente.");
            onClose();
        } catch (error) {
            Alert.alert("Error", "No se pudo agregar la canción.");
        } finally {
            setIsProcessing(false);
        }
    };

    const renderItem = ({ item }: { item: Playlist }) => (
        <TouchableOpacity 
            style={styles.playlistRow} 
            onPress={() => handleSelectPlaylist(item.id)}
            disabled={isProcessing}
        >
            {item.coverArtUrl ? (
                <Image source={{ uri: item.coverArtUrl }} style={styles.coverArt} />
            ) : (
                <View style={styles.coverArtPlaceholder}>
                    <Ionicons name="musical-notes" size={24} color={colors.textMuted} />
                </View>
            )}
            <View style={styles.playlistInfo}>
                <Text style={styles.playlistTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.playlistTracks}>
                    {item.trackCount ? `${item.trackCount} canciones` : 'Vacia'}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (!trackId) return null;

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
                                <Text style={styles.headerTitle}>Seleccionar Playlist</Text>
                                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <Ionicons name="close" size={24} color={colors.textMuted} />
                                </TouchableOpacity>
                            </View>

                            {isLoading ? (
                                <View style={styles.loaderContainer}>
                                    <ActivityIndicator size="large" color={colors.primary} />
                                </View>
                            ) : (
                                <FlatList
                                    data={playlists}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={renderItem}
                                    contentContainerStyle={styles.listContent}
                                    showsVerticalScrollIndicator={false}
                                />
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}