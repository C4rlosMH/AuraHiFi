import { StyleSheet } from 'react-native';
import { colors, frosted } from '../styles/theme';

export const styles = StyleSheet.create({
    screenContainer: {
        ... frosted,
        flex: 1,
        backgroundColor: colors.reemplazo, // Fondo ultra oscuro
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: colors.primary,
        fontSize: 18,
        fontWeight: '600',
    },
    tabBar: {
        ... frosted,
        borderRadius: 0,
        backgroundColor: colors.glassBadge, // Efecto glass oscuro
        //borderTopWidth: 1,
        elevation: 0,
        borderLeftWidth: 0,
        height: 65,
        paddingBottom: 10,
        position: 'absolute', // CLAVE: Hace que flote sobre el contenido
    }
});