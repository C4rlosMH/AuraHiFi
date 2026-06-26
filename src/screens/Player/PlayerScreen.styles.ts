import { StyleSheet } from 'react-native';
import { colors } from '../../styles/theme';

export const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: 25,
        paddingTop: 60, // Si usas barra de estado transparente, está bien.
        paddingBottom: 20, // <-- REDUCE ESTE PADDING PARA DARLE ESPACIO A LOS BOTONES
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    glassCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.glassDark,
        borderWidth: 1,
        borderColor: colors.border,
    },
    queueHeaderPanel: {
        borderRadius: 20,
        padding: 15,
        backgroundColor: colors.glassDark,
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    queueHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 15,
    },
    headerThumbnailContainer: {
        width: 44,
        height: 44,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#111111',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    headerThumbnail: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    queueHeaderMetadata: {
        flex: 1,
    },
    queueHeaderTitle: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    queueHeaderArtist: {
        color: colors.textMuted,
        fontSize: 14,
        marginTop: 2,
    },
    albumContainer: {
        width: '100%',
        maxWidth: 340, // <-- Límite máximo para que no crezca a lo loco
        flexShrink: 1, // <--- CRUCIAL: Le dice a la imagen que se haga pequeña si no hay espacio abajo
        aspectRatio: 1,
        alignSelf: 'center', // Para que quede centrada
        borderRadius: 30,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: '#111111',
        elevation: 15,
        marginTop: 10,
    },
    albumImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    floatingBadge: {
        position: 'absolute',
        top: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: colors.glassBadge,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        gap: 6,
    },
    floatingBadgeText: {
        color: colors.accent,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    queueListContainer: {
        flex: 1,
        marginTop: 15,
    },
    glassPanel: {
        borderRadius: 35,
        padding: 20, // <-- REDUCE DE 25 a 20 PARA GANAR ESPACIO
        backgroundColor: colors.glassDark,
        borderWidth: 1,
        borderColor: colors.border,
        marginTop: 15,
        marginBottom: 15, // <-- REDUCE PARA QUE LOS BOTONES DE ABAJO NO SE SALGAN
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 25,
    },
    titleText: {
        color: colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    artistText: {
        color: colors.textMuted,
        fontSize: 14,
        fontWeight: '500',
    },
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    playCircle: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    footerAction: {
        padding: 15,
    },
});