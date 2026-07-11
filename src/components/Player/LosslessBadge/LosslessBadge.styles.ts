import { StyleSheet } from 'react-native';
import { colors, frosted } from '../../../styles/theme';

export const styles = StyleSheet.create({
    badge: {
        ... frosted,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'rgba(255, 255, 255, 0.1)', // 🚀 El fondo cristalino de la burbuja
        paddingHorizontal: 12,
        paddingVertical: 6,
        //borderRadius: 16,                            // 🚀 Bordes totalmente redondeados (estilo píldora)
        //borderWidth: 1,
        //borderColor: 'rgba(255, 255, 255, 0.15)',    // 🚀 Borde sutil para darle volumen
    },
    logo: {
        height: 13,        // 🛠️ Ajusta esto dependiendo de si tu imagen es cuadrada o rectangular
        width: 25,         
        resizeMode: 'contain',
        marginRight: 6,    // Separación entre el logo y el texto
        opacity: 0.6,
    },
    text: {
        color: colors.primary, // Blanco de tu theme
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 1,      // 🚀 Da un toque muy premium a las tipografías en mayúscula
        textTransform: 'capitalize',
        opacity: 0.4

    }
});