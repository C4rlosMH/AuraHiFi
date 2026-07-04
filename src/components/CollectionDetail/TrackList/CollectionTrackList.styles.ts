import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 140, // Espacio al fondo para que la última canción no quede pegada
    },
    trackRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    trackNumber: {
        width: 30, // Ancho fijo para que los títulos queden todos alineados verticalmente
        fontSize: 16,
        color: colors.textMuted,
        fontWeight: '600',
    },
    trackInfo: {
        flex: 1, // Toma todo el espacio disponible empujando el botón de opciones a la derecha
        justifyContent: 'center',
    },
    trackTitle: {
        fontSize: 16,
        color: colors.primary, // Color correcto desde tu theme.ts
        fontWeight: '500',
        marginBottom: 4,
    },
    trackArtist: {
        fontSize: 14,
        color: colors.textMuted,
    },
    optionsButton: {
        padding: 5,
        marginLeft: 10,
    }
});