import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        marginTop: 36,
    },
    title: {
        color: colors.primary,
        fontSize: 24,
        fontWeight: '600',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    scrollContent: {
        paddingHorizontal: 20,
        gap: 16, // Requiere React Native >= 0.71 para que gap funcione en flex/scroll
    },
});