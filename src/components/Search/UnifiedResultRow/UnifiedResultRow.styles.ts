import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },
    cover: {
        width: 55,
        height: 55,
        borderRadius: 8,
        backgroundColor: colors.surface,
    },
    coverArtist: {
        borderRadius: 27.5, // Mitad exacta de 55 para un círculo perfecto
    },
    coverPlaceholder: {
        width: 55,
        height: 55,
        borderRadius: 8,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textMuted,
    },
    debugBadge: {
        fontSize: 10,
        color: colors.accent,
        marginTop: 4,
        fontWeight: 'bold',
    },
    actionButton: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});