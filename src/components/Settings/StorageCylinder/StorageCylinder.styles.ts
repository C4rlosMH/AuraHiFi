import { StyleSheet } from 'react-native';
import { colors, frosted } from '../../../styles/theme';

const CYLINDER_WIDTH = 110;
const ELLIPSE_HEIGHT = 26; // El grosor de la perspectiva 3D

export const styles = StyleSheet.create({
    container: {
        width: CYLINDER_WIDTH,
        height: 380, // Altura idéntica a HyperOS
        justifyContent: 'flex-end',
        marginRight: 25,
    },
    // --- EL TUBO DE CRISTAL VACÍO ---
    glassBackground: {
        ...StyleSheet.absoluteFillObject,
        //backgroundColor: frosted.backgroundColor,
        backgroundColor: colors.cycle,
    },
    // La magia: Un círculo perfecto que aplastamos para hacer una elipse real
    ellipseBase: {
        position: 'absolute',
        width: CYLINDER_WIDTH,
        height: CYLINDER_WIDTH,
        borderRadius: CYLINDER_WIDTH / 2,
        transform: [{ scaleY: ELLIPSE_HEIGHT / CYLINDER_WIDTH }],
    },
    glassTopLid: {
        top: -(CYLINDER_WIDTH / 2),
        //backgroundColor: frosted.backgroundColor, // Tapa superior del tubo
        backgroundColor: colors.cycle,
    },
    glassBottomLid: {
        bottom: -(CYLINDER_WIDTH / 2),
        //backgroundColor: frosted.backgroundColor, // Base del tubo
        backgroundColor: colors.cycle,
    },
    // --- LOS LÍQUIDOS ---
    liquidsWrapper: {
        flexDirection: 'column-reverse', // Apila de abajo hacia arriba nativamente
        width: CYLINDER_WIDTH,
        justifyContent: 'flex-start',
    },
    liquidBody: {
        width: CYLINDER_WIDTH,
    },
    liquidBottom: {
        bottom: -(CYLINDER_WIDTH / 2), // Cae exactamente sobre el color de abajo
    },
    liquidTop: {
        top: -(CYLINDER_WIDTH / 2),
        zIndex: 2, // Se asegura de brillar por encima de todo
    }
});