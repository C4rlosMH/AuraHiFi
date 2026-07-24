import { StyleSheet } from 'react-native';
import { colors, frosted } from '../../../styles/theme';

export const styles = StyleSheet.create({
    cardWrapper: {
        borderRadius: 24, // Mantiene el recorte suave del frosted
        overflow: 'hidden', // Evita que la imagen difuminada se salga de los bordes
        position: 'relative',
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    darkOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Una capa extra de sombra para asegurar contraste
    },
    container: {
        ...frosted,
        // No es necesario flex: 1 aquí porque el contenido dicta el tamaño, 
        // pero lo mantenemos si así lo requiere tu Home
        flex: 1, 
        padding: 20,
        justifyContent: 'space-between',
        //backgroundColor: colors.glassDark,
    },
    headerText: {
        color: colors.textMuted,
        fontSize: 14,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    trackInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
    },
    coverImage: {
        width: 84,
        height: 84,
        borderRadius: 12,
        borderWidth: 1,
        //borderColor: colors.border,
    },
    textColumn: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    title: {
        color: colors.primary,
        fontSize: 20,
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
        justifyContent: 'space-around',
        width: '100%',
        paddingTop: 5,
    },
    controlButton: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: colors.light,
        justifyContent: 'center',
        alignItems: 'center',
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
        color: colors.background,
    }
});