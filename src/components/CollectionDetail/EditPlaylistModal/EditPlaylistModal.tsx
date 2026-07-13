import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { navidromeApi } from '../../../services/navidromeApi';
import { styles } from './EditPlaylistModal.styles';
import { colors } from '../../../styles/theme';

interface EditPlaylistModalProps {
    isVisible: boolean;
    playlistId: string;
    currentName: string;
    onClose: () => void;
    onSuccess: (newName: string) => void;
}

export default function EditPlaylistModal({ isVisible, playlistId, currentName, onClose, onSuccess }: EditPlaylistModalProps) {
    const [name, setName] = useState(currentName);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isVisible) setName(currentName);
    }, [isVisible, currentName]);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert("Error", "El nombre de la playlist no puede estar vacío.");
            return;
        }

        try {
            setIsSaving(true);
            const success = await navidromeApi.updatePlaylist(playlistId, name.trim());
            
            if (success) {
                onSuccess(name.trim());
                onClose();
            } else {
                Alert.alert("Error", "No se pudo actualizar la playlist en el servidor.");
            }
        } catch (error) {
            Alert.alert("Error de conexión", "Ocurrió un problema al comunicarse con Navidrome.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal visible={isVisible} transparent={true} animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Editar Playlist</Text>
                    
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Nombre de la playlist"
                        placeholderTextColor={colors.textMuted} 
                        autoFocus={true}
                        selectTextOnFocus={true} 
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={onClose} disabled={isSaving}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave} disabled={isSaving}>
                            {isSaving ? (
                                <ActivityIndicator size="small" color={colors.background} /> 
                            ) : (
                                <Text style={styles.saveText}>Guardar</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}