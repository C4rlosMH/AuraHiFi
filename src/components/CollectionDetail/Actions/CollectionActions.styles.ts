import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

export const styles = StyleSheet.create({
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 0,
    },
    leftActions: {
        flexDirection: 'row',
        gap: 20, // Espaciado limpio entre los iconos de la izquierda
        alignItems: 'center',
    },
    iconButton: {
        padding: 5, // Área táctil extra para que sea fácil presionarlos
    },
    playButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.light, // Color dorado premium para el botón de Play
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        // Brillo sutil del color accent
        shadowColor: colors.light,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    playIconShift: {
        marginLeft: 3, // Truco visual para que el triángulo del Play se vea perfectamente centrado
    },
    progressText: {
        color: colors.light,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});