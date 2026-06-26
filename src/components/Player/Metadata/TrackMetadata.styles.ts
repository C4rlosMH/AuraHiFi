import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

export const styles = StyleSheet.create({
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 25,
    },
    textMetadataColumn: {
        flex: 1,
        paddingRight: 15,
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
});