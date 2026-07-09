import { StyleSheet } from 'react-native';
import { colors } from '../styles/theme';

export const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: colors.background, // Fondo ultra oscuro
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: colors.primary,
        fontSize: 18,
        fontWeight: '600',
    },
    tabBar: {
        backgroundColor: colors.reemplazo, // Efecto glass oscuro
        borderTopWidth: 0,
        elevation: 0,
        height: 65,
        paddingBottom: 10,
        position: 'absolute', // CLAVE: Hace que flote sobre el contenido
    }
});