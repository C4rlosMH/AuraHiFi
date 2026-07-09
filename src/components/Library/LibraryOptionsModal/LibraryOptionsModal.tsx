import React from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { styles } from './LibraryOptionsModal.styles';

interface LibraryOptionsModalProps {
    isVisible: boolean;
    onClose: () => void;
    onTriggerMathMode: () => void;
    onTriggerNewPlaylist: () => void;
    onTriggerSearch: () => void;
}

export default function LibraryOptionsModal({ 
    isVisible, 
    onClose, 
    onTriggerMathMode, 
    onTriggerNewPlaylist,
    onTriggerSearch
}: LibraryOptionsModalProps) {
    
    return (
        <Modal visible={isVisible} transparent={true} animationType="slide" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    
                    <TouchableWithoutFeedback>
                        <View style={styles.sheetContainer}>
                            <View style={styles.dragIndicator} />
                            
                            <Text style={styles.headerTitle}>Opciones de Biblioteca</Text>

                            <TouchableOpacity 
                                style={styles.optionRow} 
                                onPress={() => { onClose(); onTriggerNewPlaylist(); }}
                            >
                                <Ionicons name="add-circle-outline" size={24} style={styles.optionIcon} />
                                <Text style={styles.optionText}>Crear nueva Playlist</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.optionRow} 
                                onPress={() => { onClose(); onTriggerMathMode(); }}
                            >
                                <Ionicons name="layers-outline" size={24} style={styles.optionIcon} />
                                <Text style={styles.optionText}>Fusión</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.optionRow, { borderBottomWidth: 0 }]} 
                                onPress={() => { onClose(); onTriggerSearch(); }}
                            >
                                <Ionicons name="search-outline" size={24} style={styles.optionIcon} />
                                <Text style={styles.optionText}>Buscar Playlists locales</Text>
                            </TouchableOpacity>

                        </View>
                    </TouchableWithoutFeedback>
                    
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}