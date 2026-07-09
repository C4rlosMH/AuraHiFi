import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

export const styles = StyleSheet.create({
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    playCircle: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: colors.light,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.light,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
});