import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        width: 128,
    },
    image: {
        width: 128,
        height: 128,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 8,
    },
    title: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 2,
    },
    subtitle: {
        color: colors.textMuted,
        fontSize: 12,
    },
});