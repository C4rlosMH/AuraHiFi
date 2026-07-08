import { StyleSheet } from 'react-native';
import { colors, frosted } from '../../../styles/theme'; // 🚀 Tu constante mágica de cristal

export const styles = StyleSheet.create({
    container: {
        ...frosted,
        flexDirection: 'row',
        alignItems: 'center',
        height: 44,
        borderRadius: 21, // Bordes redondeados modernos estilo Apple Music
        paddingHorizontal: 12,
        marginHorizontal: 72,
        marginBottom: 16, // Espacio para que respire antes de la lista de canciones
    },
    searchIcon: {
        marginRight: 8,
        color: colors.textMuted,
    },
    input: {
        flex: 1,
        color: colors.primary,
        fontSize: 16,
        height: '100%',
        paddingVertical: 0, // Evita desalineaciones en Android
    },
    clearButton: {
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearIcon: {
        color: colors.textMuted,
    }
});