import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { PlaylistManagerService } from '../../../services/PlaylistManagerService';
import { styles } from './CreatePlaylistModal.styles';
import { colors } from '../../../styles/theme';

interface CreatePlaylistModalProps {
    isVisible: boolean;
    onClose: () => void;
    // Función que llamaremos para refrescar la biblioteca cuando se cree con éxito
    onSuccess: () => void; 
    initialTrackIds?: string[];
}

export default function CreatePlaylistModal({ isVisible, onClose, onSuccess, initialTrackIds = []}: CreatePlaylistModalProps) {
    const [playlistName, setPlaylistName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async () => {
        const trimmedName = playlistName.trim();
        if (!trimmedName) return;

        setIsCreating(true);
        try {
            // Mandamos un arreglo vacío [] porque apenas la estamos creando
            await PlaylistManagerService.createPlaylist(trimmedName, initialTrackIds);
            
            setPlaylistName(''); // Limpiamos el input
            onSuccess();         // Avisamos al padre que recargue la biblioteca
            onClose();           // Cerramos el modal

        } catch (error) {
            Alert.alert("Aura Hi-Fi", "No se pudo crear la playlist en el servidor.");
        } finally {
            setIsCreating(false);
        }
    };

    const handleClose = () => {
        setPlaylistName('');
        onClose();
    };

    return (
        <Modal 
            visible={isVisible} 
            transparent={true} 
            animationType="fade" 
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={styles.dialogContainer}>
                    
                    <Text style={styles.title}>Nueva Playlist</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Nombre de la playlist..."
                        placeholderTextColor={colors.textMuted}
                        value={playlistName}
                        onChangeText={setPlaylistName}
                        autoFocus={true}
                        editable={!isCreating}
                        maxLength={50} // Límite de seguridad
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={[styles.button, styles.cancelButton]} 
                            onPress={handleClose} 
                            disabled={isCreating}
                        >
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[
                                styles.button, 
                                styles.createButton, 
                                (!playlistName.trim() || isCreating) && styles.disabledButton
                            ]} 
                            onPress={handleCreate}
                            disabled={!playlistName.trim() || isCreating}
                        >
                            {isCreating ? (
                                <ActivityIndicator size="small" color={colors.primary} />
                            ) : (
                                <Text style={styles.createText}>Crear</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
}