// src/components/Library/LibraryHeader/LibraryHeader.styles.ts

import { StyleSheet } from 'react-native';
import { colors, frosted } from '../../../styles/theme'; // 🚀 Uso exclusivo de tu tema universal

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // 🚀 Empuja la lupa a la derecha de forma limpia
        marginBottom: 25,
        width: '100%',
        height: 50, // Altura fija para evitar saltos visuales molestos al alternar la búsqueda
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.primary, 
        letterSpacing: -0.5,
    },
    searchWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        ...frosted, // 🚀 Tu efecto Aura Frosted nativo
        padding: 10,
        borderRadius: 21,
        backgroundColor: colors.glassDark,
    }
});