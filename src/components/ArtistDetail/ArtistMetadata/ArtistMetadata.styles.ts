import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        padding: 18,
        backgroundColor: 'rgba(15, 15, 15, 0.7)', // 🛡️ Contenedor semitransparente oscuro premium
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', // 🚀 Alinea el nombre con los botones en el mismo eje
    },
    textInfo: {
        flex: 1, // Toma todo el espacio sobrante
        alignItems: 'flex-start', // Alinea el texto a la izquierda
        marginRight: 15,
    },
    name: {
        fontSize: 26,
        fontWeight: '900',
        color: colors.primary,
        textAlign: 'center',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    stats: {
        fontSize: 12,
        color: colors.light,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    bioContainer: {
        marginTop: 14,
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
        paddingTop: 12,
    },
    bioText: {
        color: colors.textMuted,
        fontSize: 13,
        lineHeight: 22,
        textAlign: 'justify',
    },
    bioReadMore: {
        color: colors.light,
        fontSize: 12,
        fontWeight: '700',
        textAlign: 'justify',
        marginTop: 6,
    }
});