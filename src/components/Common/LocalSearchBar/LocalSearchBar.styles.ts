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
    },
    headerVariant: {
        marginHorizontal: 0,
        marginVertical: 18,
        height: 44, // Altura exacta para encajar en el header sin estirarlo
        backgroundColor: colors.glassDark, // Un fondo esmerilado más sutil
        borderWidth: 0, // Quitamos bordes gruesos si los tiene
        borderRadius: 21,
    },
    headerInput: {
        fontSize: 16, // Quizás un texto ligeramente más grande o estándar para la cabecera
    }
});