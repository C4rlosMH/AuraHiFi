import { StyleSheet } from 'react-native';
import { frosted, colors } from '../../styles/theme'; // Importamos todo el tema

export const styles = StyleSheet.create({
    miniPlayerContainer: {
        ...frosted,
        backgroundColor: colors.glassBadge,
        position: 'absolute',
        bottom: 75,
        left: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 12,
        elevation: 10,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    coverArt: {
        width: 45,
        height: 45,
        borderRadius: 6,
        marginRight: 12,
        backgroundColor: colors.surface,
    },
    trackInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    miniPlayerTitle: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    miniPlayerArtist: {
        color: colors.textMuted,
        fontSize: 14,
    },
    controlsContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 8,
    },
    navButton: {
        padding: 6,
    },
    playButton: {
        backgroundColor: colors.light, // Usamos el color de acento centralizado
        width: 36,
        height: 36,
        borderRadius: 18, 
        justifyContent: 'center',
        alignItems: 'center',
    }
});