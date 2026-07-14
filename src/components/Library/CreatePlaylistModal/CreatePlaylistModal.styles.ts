import { StyleSheet } from 'react-native';
import { colors, frosted } from '../../../styles/theme';

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'transparent', // Fondo oscuro semi-transparente
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    dialogContainer: {
        ...frosted, // Efecto Aura Frosted nativo
        backgroundColor: colors.reemplazo,
        width: '100%',
        padding: 24,
    },
    title: {
        color: colors.primary,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        backgroundColor: colors.glassDark,
        color: colors.primary,
        borderRadius: 21,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        ...frosted,
        //backgroundColor: 'transparent',
    },
    cancelText: {
        color: colors.textMuted,
        fontSize: 16,
        fontWeight: '600',
    },
    createButton: {
        backgroundColor: colors.light, // Usamos tu color principal de acción
        borderRadius: 21,
    },
    createText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.4,
    }
});