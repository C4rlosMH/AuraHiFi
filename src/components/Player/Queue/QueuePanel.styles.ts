import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

export const styles = StyleSheet.create({
    queueContainer: {
        flex: 1, 
        marginTop: 5,
        paddingHorizontal: 10, 
    },
    queueHeader: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 15,
        borderBottomWidth: StyleSheet.hairlineWidth, 
        borderColor: colors.glassDark,
        paddingBottom: 10,
    },
    queueList: {
        flex: 1,
    },
    queueItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10, 
        borderBottomWidth: 0.5,
        marginBottom: 4,
        borderColor: colors.glassDark,
        paddingHorizontal: 10, // Añadimos padding para que el texto no toque el borde
        gap: 12, 
    },
    queueItemActive: {
        backgroundColor: colors.glassBadge, 
        borderRadius: 12,
    },
    coverArt: {
        width: 46,
        height: 46,
        borderRadius: 8,
        backgroundColor: colors.glassDark,
    },
    // Eliminada la clase queueIndex
    queueTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    queueTitle: {
        color: colors.primary,
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    queueTitleActive: {
        color: colors.light,
    },
    queueArtist: {
        color: colors.textMuted,
        fontSize: 13,
        marginTop: 3,
        fontWeight: '400',
    },
    playingIndicator: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 14,
        gap: 2,
        paddingBottom: 2,
    },
    eqBar: {
        width: 3,
        height: 12,
        backgroundColor: colors.light,
        borderRadius: 2,
    },
    deleteAction: {
        backgroundColor: '#f12b20', 
        justifyContent: 'center',
        alignItems: 'center',
        width: 75,
        marginBottom: 4,
        borderRadius: 12,
        marginLeft: 10,
    },
    deleteIcon: {
        color: colors.primary, 
    },

    deleteIconAnimated: {},
    placeholderIcon: {
        color: colors.textMuted,
    },
});