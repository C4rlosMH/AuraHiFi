import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 15,
        marginTop: 15
    },
    trackRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    trackNumberContainer: {
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    trackNumber: {
        color: colors.textMuted,
        fontSize: 14,
        fontWeight: '600',
    },
    coverArt: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: colors.surface,
        marginRight: 12,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    trackTitle: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    trackArtist: {
        color: colors.textMuted,
        fontSize: 13,
    },
    actionButton: {
        padding: 10,
    }
});