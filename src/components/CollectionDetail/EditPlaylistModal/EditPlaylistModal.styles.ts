import { StyleSheet } from 'react-native';
import { colors, frosted } from '../../../styles/theme';

export const styles = StyleSheet.create({
    overlay: {
        
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        padding: 20,
    },
    modalContainer: {
        ... frosted,
        backgroundColor: colors.reemplazo,
        borderRadius: 16,
        padding: 24,
        elevation: 10,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    title: {
        color: colors.primary,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        backgroundColor: colors.surface,
        color: colors.primary,
        borderRadius: 10,
        padding: 14,
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginBottom: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12, // Espacio entre botones
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        minWidth: 90,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: colors.light,
    },
    cancelText: {
        color: colors.textMuted,
        fontSize: 16,
        fontWeight: '600',
    },
    saveText: {
        color: colors.black, // primaryo oscuro para contrastar con tu color primario (acento)
        fontSize: 16,
        fontWeight: 'bold',
    }
});