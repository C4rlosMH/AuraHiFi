// src/components/Home/Cards/TopMixCard.styles.ts
import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        width: '49%', // 🚀 CAMBIO CLAVE: Usa casi la mitad de la pantalla, dejando espacio para el gap
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.glassDark,
        borderRadius: 12,
        padding: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    image: {
        width: 48,
        height: 48,
        borderRadius: 8,
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    title: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    subtitle: {
        color: colors.textMuted,
        fontSize: 11,
    },
});