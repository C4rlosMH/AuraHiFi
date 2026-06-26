import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

export const styles = StyleSheet.create({
    queueContainer: {
        flex: 1, 
        marginTop: 5,
        paddingHorizontal: 5, 
    },
    queueHeader: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 15,
        borderBottomWidth: StyleSheet.hairlineWidth, 
        borderColor: 'rgba(255, 255, 255, 0.1)',
        paddingBottom: 10,
    },
    queueList: {
        flex: 1,
    },
    queueItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12, 
        borderBottomWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.03)',
        paddingHorizontal: 10, // Añadimos padding para que el texto no toque el borde
        gap: 15, 
    },
    queueItemActive: {
        backgroundColor: 'rgba(0, 255, 204, 0.08)', 
        borderRadius: 12,
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
    },
    queueTitleActive: {
        color: colors.accent,
        fontWeight: 'bold',
    },
    queueArtist: {
        color: colors.textMuted,
        fontSize: 13,
        marginTop: 3,
    },
});