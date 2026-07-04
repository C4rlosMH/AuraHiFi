import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme'; // 🚀 Uso exclusivo de tu tema universal

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.primary, // Jala el color blanco centralizado
        letterSpacing: -0.5,
    }
});