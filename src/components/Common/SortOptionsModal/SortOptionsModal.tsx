import React from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './SortOptionsModal.styles';
import { colors } from '../../../styles/theme';

export type SortType = 'custom' | 'recent' | 'title' | 'artist' | 'album';

interface SortOptionsModalProps {
    isVisible: boolean;
    currentSort: SortType;
    onClose: () => void;
    onSelectSort: (sortType: SortType) => void;
}

export default function SortOptionsModal({ isVisible, currentSort, onClose, onSelectSort }: SortOptionsModalProps) {
    
    const options: { id: SortType; label: string }[] = [
        { id: 'custom', label: 'Orden personalizado' },
        { id: 'recent', label: 'Agregado recientemente' },
        { id: 'title', label: 'Título' },
        { id: 'artist', label: 'Artista' },
        { id: 'album', label: 'Álbum' },
    ];

    if (!isVisible) return null;

    return (
        <Modal visible={isVisible} transparent={true} animationType="slide" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.bottomSheet}>
                            <View style={styles.dragHandleContainer}>
                                <View style={styles.dragHandle} />
                            </View>
                            
                            <Text style={styles.headerTitle}>Ordenar por</Text>

                            {options.map((option) => (
                                <TouchableOpacity 
                                    key={option.id} 
                                    style={styles.optionRow} 
                                    onPress={() => {
                                        onSelectSort(option.id);
                                        onClose();
                                    }}
                                >
                                    <Text style={currentSort === option.id ? styles.optionTextActive : styles.optionText}>
                                        {option.label}
                                    </Text>
                                    
                                    {currentSort === option.id && (
                                        <Ionicons name="checkmark" size={24} color={colors.primary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}