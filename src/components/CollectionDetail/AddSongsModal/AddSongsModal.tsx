import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, ActivityIndicator, Alert, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { navidromeApi, Track } from '../../../services/navidromeApi';
import { PlaylistManagerService } from '../../../services/PlaylistManagerService';
import { styles } from './AddSongsModal.styles';
import { colors } from '../../../styles/theme';

interface AddSongsModalProps {
    isVisible: boolean;
    playlistId: string;
    onClose: () => void;
    onSuccess: () => void; // Para recargar el CollectionDetail
}

export default function AddSongsModal({ isVisible, playlistId, onClose, onSuccess }: AddSongsModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [tracks, setTracks] = useState<Track[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // Referencia para controlar el temporizador de búsqueda (Debounce)
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (isVisible) {
            // Limpiamos todo al abrir el modal
            setSearchQuery('');
            setTracks([]);
            setSelectedIds([]);
        }
    }, [isVisible]);

    // Escuchamos cada vez que el usuario escribe en el buscador
    useEffect(() => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        if (searchQuery.trim().length > 1) {
            setIsLoading(true);
            // Esperamos 500ms después de que deje de escribir para llamar al servidor
            searchTimeout.current = setTimeout(() => {
                performSearch(searchQuery);
            }, 500);
        } else {
            setTracks([]);
            setIsLoading(false);
        }

        return () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        };
    }, [searchQuery]);

    const performSearch = async (query: string) => {
        try {
            const results = await navidromeApi.searchTracks(query);
            setTracks(results);
        } catch (error) {
            console.error("Error en búsqueda:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleSave = async () => {
        if (selectedIds.length === 0) return;
        setIsSaving(true);
        try {
            await PlaylistManagerService.addTracksToPlaylist(playlistId, selectedIds);
            onSuccess();
            onClose();
        } catch (error) {
            Alert.alert("Error", "No se pudieron añadir las canciones a la playlist.");
        } finally {
            setIsSaving(false);
        }
    };

    const renderTrack = ({ item }: { item: Track }) => {
        const isSelected = selectedIds.includes(item.id);
        return (
            <TouchableOpacity style={styles.trackRow} onPress={() => toggleSelection(item.id)} activeOpacity={0.7}>
                <View style={styles.trackInfo}>
                    <Text style={styles.trackTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.trackArtist} numberOfLines={1}>{item.artist} • {item.album}</Text>
                </View>
                <Ionicons 
                    name={isSelected ? "checkmark-circle" : "ellipse-outline"} 
                    size={24} 
                    color={isSelected ? colors.light : colors.textMuted} 
                />
            </TouchableOpacity>
        );
    };

    return (
        <Modal visible={isVisible} transparent={true} animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.sheetContainer}>
                    <View style={styles.dragIndicator} />
                    
                    <Text style={styles.headerTitle}>Buscar en Navidrome</Text>

                    {/* BUSCADOR GLOBAL */}
                    <View style={styles.searchInputContainer}>
                        <Ionicons name="search" size={20} color={colors.textMuted} />
                        <TextInput 
                            style={styles.searchInput}
                            placeholder="Buscar canciones o artistas..."
                            placeholderTextColor={colors.textMuted}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus={true}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-circle" size={20} color={colors.textMuted} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* LISTA DE RESULTADOS */}
                    {isLoading ? (
                        <View style={styles.loader}><ActivityIndicator size="large" color={colors.light} /></View>
                    ) : (
                        <FlatList
                            data={tracks}
                            keyExtractor={item => item.id}
                            renderItem={renderTrack}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>
                                    {searchQuery.length > 1 ? "No se encontraron canciones." : "Escribe algo para buscar en tu servidor."}
                                </Text>
                            }
                            showsVerticalScrollIndicator={false}
                        />
                    )}

                    {/* BOTÓN GUARDAR */}
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity 
                            style={[styles.addButton, (selectedIds.length === 0 || isSaving) && styles.disabledButton]} 
                            onPress={handleSave}
                            disabled={selectedIds.length === 0 || isSaving}
                        >
                            {isSaving ? (
                                <ActivityIndicator size="small" color={colors.primary} />
                            ) : (
                                <Text style={styles.addButtonText}>Añadir {selectedIds.length > 0 ? selectedIds.length : ''} canciones</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
}