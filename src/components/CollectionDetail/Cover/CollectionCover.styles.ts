import { StyleSheet, Dimensions } from 'react-native';
import {colors} from '../../../styles/theme'

// Obtenemos el ancho exacto de la pantalla del celular
const { width } = Dimensions.get('window');


export const styles = StyleSheet.create({
    container: {
        width: width,
        height: width, // Lo hacemos un cuadrado perfecto (relación 1:1)
        backgroundColor: colors.background, // Color de fondo por si la imagen tarda 1 segundo en cargar
        elevation: 10,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});