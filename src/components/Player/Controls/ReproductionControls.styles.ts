import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

export const styles = StyleSheet.create({
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    playCircle: {
        width: 64,
        height: 64,
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
    repeatButton: {
        position: 'relative',
    },
    repeatBadge: {
        position: 'absolute',
        top: -2,
        right: -4,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    repeatBadgeText: {
        fontSize: 9,
        fontWeight: 'bold',
    },
});