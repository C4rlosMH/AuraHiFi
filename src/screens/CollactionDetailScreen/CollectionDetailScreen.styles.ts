import { StyleSheet, Dimensions } from 'react-native';
import { colors, frosted } from '../../styles/theme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    coverContainer: {
        width: width,
        height: width, // Cuadrado perfecto ocupando la mitad superior
        position: 'relative',
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 150,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: 'rgba(0,0,0,0.4)', // Simula un gradiente oscuro
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.primary,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textMuted,
        fontWeight: '600',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    leftActions: {
        flexDirection: 'row',
        gap: 15,
    },
    iconButton: {
        ...frosted,
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButton: {
        backgroundColor: colors.accent,
        width: 55,
        height: 55,
        borderRadius: 27.5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
    trackListContainer: {
        paddingHorizontal: 20,
        paddingBottom: 120, // Espacio para el mini-player
    },
    trackRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    trackNumber: {
        width: 30,
        fontSize: 14,
        color: colors.textMuted,
        fontWeight: '600',
    },
    trackInfo: {
        flex: 1,
        paddingRight: 15,
    },
    trackTitle: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: '500',
        marginBottom: 4,
    },
    trackArtist: {
        fontSize: 13,
        color: colors.textMuted,
    },
});