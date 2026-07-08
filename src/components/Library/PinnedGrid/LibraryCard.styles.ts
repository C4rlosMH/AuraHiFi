// src/components/Library/PinnedGrid/LibraryCard.styles.ts

import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../styles/theme';

const { width } = Dimensions.get('window');
// Matemáticas: Ancho total - 40px (padding pantalla) - 20px (dos espacios de gap de 10px) = Dividido entre 3
const cardWidth = Math.floor((width - 60) / 3);

export const styles = StyleSheet.create({
    cardContainer: {
        width: cardWidth,
        marginBottom: 16,
    },
    imageContainer: {
        width: cardWidth,
        height: cardWidth,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: colors.glassDark,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        overflow: 'hidden', 
    },
    squareBorder: {
        borderRadius: 12, 
    },
    circleBorder: {
        borderRadius: cardWidth / 2, 
    },
    image: {
        width: '100%',
        height: '100%',
    },
    folderIconContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pinBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: colors.light, 
        borderRadius: 12,
        padding: 4,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
    },
    infoContainer: {
        width: '100%',
        paddingHorizontal: 2,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.primary,
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 12,
        color: colors.textMuted,
    },
    // 🚀 ESTILOS AISLADOS DE SELECCIÓN MÚLTIPLE
    overlayBase: {
        ...StyleSheet.absoluteFillObject,
        padding: 8,
        alignItems: 'flex-end',
    },
    overlayUnselected: {
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    overlaySelected: {
        backgroundColor: 'rgba(0, 255, 204, 0.15)',
    },
    overlayDisabled: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.65)',
    },
    checkboxCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxUnchecked: {
        borderColor: 'rgba(255,255,255,0.7)',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    checkboxChecked: {
        borderColor: colors.accent,
        backgroundColor: colors.accent,
    },
    checkmark: {
        color: '#0a0a0c',
        fontWeight: 'bold',
        fontSize: 12,
    }
});