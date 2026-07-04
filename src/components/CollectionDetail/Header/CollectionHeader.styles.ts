import { StyleSheet } from 'react-native';
import { frosted } from '../../../styles/theme';

export const styles = StyleSheet.create({
    headerContainer: {
        position: 'absolute',
        top: 50, // Margen seguro para la barra de estado de Android
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'transparent',
    },
    iconButton: {
        // Inyectamos todo el plano esmerilado PRIMERO
        ...frosted, 
        
        // Y luego definimos la geometría exacta de nuestro botón circular
        width: 42,
        height: 42,
        borderRadius: 21, // Esto sobrescribe el 20 del tema original
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBackShift: {
        marginRight: 2, 
    }
});