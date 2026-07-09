import { StyleSheet } from 'react-native';
import { colors, frosted } from '../../../styles/theme';

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'transparent', // Fondo oscuro semi-transparente
        justifyContent: 'flex-end',
    },
    sheetContainer: {
        ...frosted,
        backgroundColor: colors.reemplazo,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        paddingTop: 12,
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    dragIndicator: {
        width: 40,
        height: 5,
        backgroundColor: colors.textMuted,
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        color: colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    optionIcon: {
        marginRight: 16,
        color: colors.light, // Usamos el color light para destacar las acciones
    },
    optionText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '500',
    }
});