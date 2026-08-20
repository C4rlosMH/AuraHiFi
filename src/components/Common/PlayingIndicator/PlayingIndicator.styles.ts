import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

export const styles = StyleSheet.create({
    playingIndicator: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        height: 14,
        gap: 2,
    },
    eqBar: {
        width: 3,
        height: 12,
        backgroundColor: colors.light,
        borderRadius: 2,
    },
});