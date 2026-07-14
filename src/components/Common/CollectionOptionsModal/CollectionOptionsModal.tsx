import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { styles } from './CollectionOptionsModal.styles';
import { colors } from '../../../styles/theme'

interface CollectionOptionsModalProps {
    isVisible: boolean;
    onClose: () => void;
    title: string;
    subtitle: string;
    type: 'album' | 'playlist' | 'artist' | 'local_folder';
    coverArtUrl?: string;
    
    // Estados booleanos para alternar textos/iconos
    isPinned?: boolean;
    isDownloaded?: boolean;
    isInLibrary?: boolean;

    // Callbacks Generales
    onAddToQueue?: () => void;
    onRemoveDownload?: () => void;
    onStartJam?: () => void;

    // Callbacks de Playlist
    onTogglePin?: () => void;
    onDeletePlaylist?: () => void;
    onAddSongs?: () => void;
    onEditOrder?: () => void;
    onEditMetadata?: () => void;
    onChangeCover?: () => void;
    onAutoSort?: () => void;

    // Callbacks de Álbum
    isAlbumSaved?: boolean;
    onToggleLibrary?: () => void;
    onGoToArtist?: () => void;
    onCreateStation?: () => void;
}

export default function CollectionOptionsModal({
    isVisible,
    onClose,
    title,
    subtitle,
    type,
    coverArtUrl,
    isPinned = false,
    isDownloaded = false,
    isInLibrary = false,
    onAddToQueue,
    onRemoveDownload,
    onStartJam,
    onTogglePin,
    onDeletePlaylist,
    onAddSongs,
    onEditOrder,
    onEditMetadata,
    onChangeCover,
    onAutoSort,
    isAlbumSaved,
    onToggleLibrary,
    onGoToArtist,
    onCreateStation
}: CollectionOptionsModalProps) {
    
    if (!isVisible) return null;

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
                                {coverArtUrl ? (
                                    <Image source={{ uri: coverArtUrl }} style={styles.coverArt} />
                                ) : (
                                    <View style={styles.coverArtPlaceholder}>
                                        <Ionicons name="albums-outline" size={24} style={styles.placeholderIcon} />
                                    </View>
                                )}
                                <View style={styles.headerTextContainer}>
                                    <Text style={styles.collectionTitle} numberOfLines={2}>{title}</Text>
                                    <Text style={styles.collectionSubtitle} numberOfLines={1}>{subtitle}</Text>
                                </View>
                            </View>

                            {/* Envolvemos en ScrollView por la gran cantidad de opciones en Playlists */}
                            <ScrollView showsVerticalScrollIndicator={false}>
                                
                                {/* ---------------- ZONA PLAYLIST ---------------- */}
                                {type === 'playlist' && (
                                    <>
                                        <TouchableOpacity style={styles.optionRow} onPress={onAddToQueue}>
                                            <Ionicons name="list-circle-outline" size={24} style={styles.optionIcon} />
                                            <Text style={styles.optionText}>Añadir a la fila</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.optionRow} onPress={onAddSongs}>
                                            <Ionicons name="add-circle-outline" size={24} style={styles.optionIcon} />
                                            <Text style={styles.optionText}>Añadir canciones</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.optionRow} onPress={onAutoSort}>
                                            <Ionicons name="filter-outline" size={24} style={styles.optionIcon} />
                                            <Text style={styles.optionText}>Ordenar automáticamente</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.optionRow} onPress={onEditMetadata}>
                                            <Ionicons name="pencil-outline" size={24} style={styles.optionIcon} />
                                            <Text style={styles.optionText}>Editar detalles</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.optionRow} onPress={onChangeCover}>
                                            <Ionicons name="image-outline" size={24} style={styles.optionIcon} />
                                            <Text style={styles.optionText}>Cambiar portada</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.optionRow} onPress={onTogglePin}>
                                            <Ionicons 
                                                name={isPinned ? "pin" : "pin-outline"} 
                                                size={24} 
                                                style={isPinned ? styles.pinIconActive : styles.optionIcon} 
                                            />
                                            <Text style={styles.optionText}>
                                                {isPinned ? "Desfijar del inicio" : "Fijar en el inicio"}
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.optionRow} onPress={onDeletePlaylist}>
                                            <Ionicons name="trash-outline" size={24} style={{ color: '#ff4444', marginRight: 15 }} />
                                            <Text style={[styles.optionText, { color: '#ff4444' }]}>Eliminar playlist</Text>
                                        </TouchableOpacity>
                                    </>
                                )}

                                {/* ---------------- ZONA ÁLBUM ---------------- */}
                                {type === 'album' && (
                                    <>
                                        <TouchableOpacity style={styles.optionRow} onPress={onAddToQueue}>
                                            <Ionicons name="list-circle-outline" size={24} style={styles.optionIcon} />
                                            <Text style={styles.optionText}>Añadir a la fila</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.optionRow} onPress={onTogglePin}>
                                            <Ionicons 
                                                name={isPinned ? "pin" : "pin-outline"} 
                                                size={24} 
                                                style={isPinned ? styles.pinIconActive : styles.optionIcon} 
                                            />
                                            <Text style={styles.optionText}>
                                                {isPinned ? "Desfijar del inicio" : "Fijar en el inicio"}
                                            </Text>
                                        </TouchableOpacity>

                                        {type === 'album' && onToggleLibrary && (
                                            <TouchableOpacity style={styles.optionRow} onPress={onToggleLibrary}>
                                                <Ionicons 
                                                    name={isAlbumSaved ? "checkmark-circle" : "add-circle-outline"} 
                                                    size={24} 
                                                    color={isAlbumSaved ? colors.primary : colors.primary} 
                                                />
                                                <Text style={[styles.optionText, isAlbumSaved && { color: colors.primary }]}>
                                                    {isAlbumSaved ? "Eliminar de tu biblioteca" : "Añadir a tu biblioteca"}
                                                </Text>
                                            </TouchableOpacity>
                                        )}

                                        <TouchableOpacity style={styles.optionRow} onPress={onCreateStation}>
                                            <Ionicons name="radio-outline" size={24} style={styles.optionIcon} />
                                            <Text style={styles.optionText}>Crear estación del álbum</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.optionRow} onPress={onGoToArtist}>
                                            <Ionicons name="person-outline" size={24} style={styles.optionIcon} />
                                            <Text style={styles.optionText}>Ir al artista</Text>
                                        </TouchableOpacity>
                                    </>
                                )}

                                {/* ---------------- ZONA ARTISTA ---------------- */}
                                {type === 'artist' && (
                                    <>
                                        <TouchableOpacity style={styles.optionRow} onPress={onCreateStation}>
                                            <Ionicons name="radio-outline" size={24} style={styles.optionIcon} />
                                            <Text style={styles.optionText}>Crear estación del artista</Text>
                                        </TouchableOpacity>
                                    </>
                                )}

                                {/* ---------------- ZONA COMPARTIDA (UNIVERSALES) ---------------- */}
                                {isDownloaded && (
                                    <TouchableOpacity style={styles.optionRow} onPress={onRemoveDownload}>
                                        <Ionicons name="trash-bin-outline" size={24} style={styles.optionIcon} />
                                        <Text style={styles.optionText}>Eliminar descarga</Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity style={styles.optionRow} onPress={onStartJam}>
                                    <MaterialIcons name="podcasts" size={24} style={styles.optionIcon} />
                                    
                                    <Text style={styles.optionText}>Empezar una Jam</Text>
                                </TouchableOpacity>

                                {/* Espaciador inferior para el scroll */}
                                <View style={{ height: 20 }} />
                            </ScrollView>

                        </View>
                    </TouchableWithoutFeedback>

                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}