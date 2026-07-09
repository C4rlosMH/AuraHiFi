import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 15,
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
    },
    addAction: {
        backgroundColor: colors.light, // Usamos tu color insignia (Cian)
        justifyContent: 'center',
        alignItems: 'flex-start', // Alineado a la izquierda porque empujamos hacia la derecha
        paddingLeft: 25,
        marginBottom: 8, // Para igualar el margen de la pista
        borderRadius: 8,
        flex: 1,
    },
    addActionIcon: {
        color: colors.surface, // Negro o el color de fondo para que contraste con el Cian
    },
    coverArt:{
        width: 44,
        height: 44,
        borderRadius: 6,
        marginRight: 12,
    }
});