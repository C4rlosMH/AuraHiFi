import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, FlatList, ActivityIndicator, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { navidromeApi, Track } from '../../../services/navidromeApi';
import { localLibraryService } from '../../../services/LocalLibraryService';
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
    const [activeTab, setActiveTab] = useState<'favorites' | 'downloads'>('favorites');
    const [tracks, setTracks] = useState<Track[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setSelectedIds([]);
            fetchTracks(activeTab);
        }
    }, [isVisible, activeTab]);

    const fetchTracks = async (tab: 'favorites' | 'downloads') => {
        setIsLoading(true);
        try {
            if (tab === 'favorites') {
                const favs = await navidromeApi.getStarredTracks();
                setTracks(favs);
            } else {
                const down = await localLibraryService.getDownloadedTracks();
                // Omitiremos portadas locales pesadas en este modal para velocidad
                setTracks(down.map(t => ({ id: t.id, title: t.title, artist: t.artist } as Track)));
            }
        } catch (error) {
            console.error("Error al cargar canciones sugeridas", error);
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
                    <Text style={styles.trackArtist} numberOfLines={1}>{item.artist}</Text>
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
                    
                    <Text style={styles.headerTitle}>Añadir Canciones</Text>

                    {/* PESTAÑAS */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity 
                            style={[styles.tab, activeTab === 'favorites' && styles.activeTab]} 
                            onPress={() => setActiveTab('favorites')}
                        >
                            <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>Favoritos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.tab, activeTab === 'downloads' && styles.activeTab]} 
                            onPress={() => setActiveTab('downloads')}
                        >
                            <Text style={[styles.tabText, activeTab === 'downloads' && styles.activeTabText]}>Descargas</Text>
                        </TouchableOpacity>
                    </View>

                    {/* LISTA */}
                    {isLoading ? (
                        <View style={styles.loader}><ActivityIndicator size="large" color={colors.light} /></View>
                    ) : (
                        <FlatList
                            data={tracks}
                            keyExtractor={item => item.id}
                            renderItem={renderTrack}
                            ListEmptyComponent={<Text style={styles.emptyText}>No hay canciones en esta sección.</Text>}
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
                                <Text style={styles.addButtonText}>Añadir {selectedIds.length} canciones</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
}