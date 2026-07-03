import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#000000', // Fondo ultra oscuro
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    tabBar: {
        backgroundColor: 'rgba(10, 10, 10, 0.95)', // Efecto glass oscuro
        borderTopWidth: 0,
        elevation: 0,
        height: 65,
        paddingBottom: 10,
        position: 'absolute', // CLAVE: Hace que flote sobre el contenido
    }
});