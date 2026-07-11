import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        width: 160,
    },
    image: {
        width: 160,
        height: 160,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 10,
    },
    title: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    highlight: {
        color: colors.light, // #7B7BEA para destacar
        fontSize: 12,
        fontWeight: '500',
    },
});