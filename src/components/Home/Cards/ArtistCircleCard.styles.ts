import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        width: 80,
        alignItems: 'center',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40, // 50% para hacerlo un círculo perfecto
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 8,
    },
    name: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
});