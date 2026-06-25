import { StyleSheet } from 'react-native';
import { colors } from '../../styles/theme';

export const styles = StyleSheet.create({
    queueContainer: {
        width: '100%',
        aspectRatio: 1,
        marginTop: 20,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: colors.border,
        padding: 20,
    },
    queueHeader: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        paddingBottom: 8,
    },
    queueList: {
        flex: 1,
    },
    queueItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.03)',
        gap: 12,
    },
    queueItemActive: {
        backgroundColor: 'rgba(0, 255, 204, 0.05)',
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    queueIndex: {
        color: colors.textMuted,
        fontSize: 12,
        width: 20,
        textAlign: 'center',
        fontFamily: 'monospace',
    },
    queueTextContainer: {
        flex: 1,
    },
    queueTitle: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    queueTitleActive: {
        color: colors.accent,
        fontWeight: 'bold',
    },
    queueArtist: {
        color: colors.textMuted,
        fontSize: 12,
        marginTop: 2,
    },
});