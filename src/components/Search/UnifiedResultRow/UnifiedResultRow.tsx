import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './UnifiedResultRow.styles';
import { UnifiedSearchItem } from '../../../services/globalSearchManager';
import { colors } from '../../../styles/theme';

interface UnifiedResultRowProps {
    item: UnifiedSearchItem;
    onPress: (item: UnifiedSearchItem) => void;
    onActionPress: (item: UnifiedSearchItem) => void;
}

export default function UnifiedResultRow({ item, onPress, onActionPress }: UnifiedResultRowProps) {
    
    const renderActionIcon = () => {
        // Regla 1: Si es un artista, mostramos flecha para ir a su perfil.
        if (item.type === 'artist') {
            return <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />;
        }

        // Regla 2: Si es una canción individual (sea local o del servidor), mostramos Play.
        if (item.type === 'track') {
            return <Ionicons name="play-circle" size={28} color={colors.light} />;
        }

        // Regla 3: Si es un álbum del NAS y ya lo tienes en tu biblioteca, mostramos palomita.
        if (item.type === 'album' && item.source === 'nas' && item.isSaved) {
            return <Ionicons name="checkmark-circle" size={28} color={colors.light} />;
        }

        // Comportamiento por defecto (Álbumes no guardados y Búsquedas en Internet)
        switch (item.source) {
            case 'nas':
                // Álbum del servidor que NO está en la biblioteca
                return <Ionicons name="add-circle-outline" size={28} color={colors.primary} />;
            case 'global':
                // Resultado de Internet
                return <Ionicons name="add-circle-outline" size={28} color={colors.primary} />;
            default:
                return <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />;
        }
    };

    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress(item)}>
            {item.coverArtUrl ? (
                <Image 
                    source={{ uri: item.coverArtUrl }} 
                    style={[styles.cover, item.type === 'artist' && styles.coverArtist]} 
                />
            ) : (
                <View style={[styles.coverPlaceholder, item.type === 'artist' && styles.coverArtist]}>
                    <Ionicons 
                        name={item.type === 'artist' ? "person-outline" : "musical-notes-outline"} 
                        size={24} 
                        color={colors.textMuted} 
                    />
                </View>
            )}

            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.subtitle} numberOfLines={1}>{item.subtitle}</Text>
                
                {item.source === 'global' && item.mbid && (
                    <Text style={styles.debugBadge}>MBID OK</Text>
                )}
            </View>

            <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => onActionPress(item)}
            >
                {renderActionIcon()}
            </TouchableOpacity>
        </TouchableOpacity>
    );
}