import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

export const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 100, // Lo elevamos para que no lo tape el TabBar ni el MiniPlayer
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        // Usamos tu color light pero con opacidad para el fondo
        backgroundColor: 'rgba(123, 123, 234, 0.2)', 
        borderWidth: 1,
        borderColor: 'rgba(123, 123, 234, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        // Sombra / Brillo (Aura effect)
        shadowColor: colors.light,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 8,
        zIndex: 100,
    },
    iconColor: {
        color: colors.light,
    }
});