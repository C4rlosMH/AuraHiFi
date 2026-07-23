import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.glassDark,
    },
    iconContainer: {
        width: 44,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingRight: 10,
    },
    title: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    subtitle: {
        color: colors.textMuted,
        fontSize: 13,
    },
    rightIcon: {
        color: colors.textMuted,
        opacity: 0.5,
    }
});