import { StyleSheet } from 'react-native';
import { colors, frosted } from '../../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        ...frosted,
        flex: 1, 
        padding: 20, // Más aire para que respire el diseño
        justifyContent: 'space-between', // Distribuye perfectamente el header, la info y los controles
        backgroundColor: colors.glassDark, // Usamos tu cristal oscuro del tema
    },
    headerText: {
        color: colors.textMuted, // Color de acento de tu tema (#7B7BEA)
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    trackInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
    },
    coverImage: {
        width:84, // Aumentado de 48 para un aspecto más audiófilo
        height: 84,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    textColumn: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    title: {
        color: colors.primary,
        fontSize: 20, // Tipografía más grande y legible
        fontWeight: '700',
        marginBottom: 4,
    },
    artist: {
        color: colors.textMuted,
        fontSize: 14,
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around', // Distribuye los botones horizontalmente de forma elegante
        width: '100%',
        paddingTop: 5,
    },
    controlButton: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButton: {
        width: 52, // Botón de reproducción más grande y ergonómico
        height: 52,
        borderRadius: 26,
        backgroundColor: colors.light, // Blanco sólido de tu tema
        justifyContent: 'center',
        alignItems: 'center',
        // Sombra sutil para darle relieve al botón de Play
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    iconColor: {
        color: colors.primary,
    },
    playIconColor: {
        color: colors.background, // Icono oscuro sobre el botón blanco
    }
});