import { StyleSheet } from 'react-native';
import { colors, frosted } from '../../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    scrollContent: {
        gap: 12, // Espacio entre cápsulas
        paddingRight: 15, // Para que el último elemento no se corte feo al deslizar
    },
    chip: {
        ...frosted,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
    },
    chipActive: {
        backgroundColor: 'rgba(0, 255, 204, 0.12)', // Fondo sutil color cian
        borderColor: colors.accent,
    },
    chipText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    chipTextActive: {
        color: colors.accent,
    },
    icon: {
        marginRight: 6,
    }
});