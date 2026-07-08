// src/components/Library/PinnedGrid/LibraryCard.tsx

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { styles } from './LibraryCard.styles';
import { colors } from '../../../styles/theme';

interface LibraryCardProps {
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    type?: 'album' | 'playlist' | 'artist' | 'folder';
    iconName?: string;
    onPress: () => void;
    showPin?: boolean;
    onLongPress?: () => void;
    isSelectMode?: boolean;
    isSelected?: boolean;
}

export default function LibraryCard({ 
    id, title, subtitle, imageUrl, type = 'album', iconName, onPress, showPin = false,
    onLongPress, isSelectMode = false, isSelected = false 
}: LibraryCardProps) {
    
    const isArtist = type === 'artist';
    const shapeStyle = isArtist ? styles.circleBorder : styles.squareBorder;
    
    return (
        <TouchableOpacity 
            style={styles.cardContainer} 
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.7}
        >
            <View style={[styles.imageContainer, shapeStyle]}>
                {type === 'folder' && iconName ? (
                    <View style={styles.folderIconContainer}>
                        <Ionicons name={iconName} size={32} color={colors.accent} />
                    </View>
                ) : imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={[styles.image, shapeStyle]} />
                ) : (
                    <Ionicons 
                        name={isArtist ? "person" : "musical-notes"} 
                        size={28} 
                        color={colors.textMuted} 
                    />
                )}
                {showPin && (
                    <View style={styles.pinBadge}>
                        <Ionicons name="pin" size={12} color={colors.accent} />
                    </View>
                )}

                {/* 🚀 LÓGICA VISUAL PURA */}
                {isSelectMode && type === 'playlist' && (
                    <View style={[
                        styles.overlayBase,
                        isSelected ? styles.overlaySelected : styles.overlayUnselected
                    ]}>
                        <View style={[
                            styles.checkboxCircle,
                            isSelected ? styles.checkboxChecked : styles.checkboxUnchecked
                        ]}>
                            {isSelected && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                    </View>
                )}
                {isSelectMode && type !== 'playlist' && (
                    <View style={styles.overlayDisabled} />
                )}
            </View>
            
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
            </View>
        </TouchableOpacity>
    );
}