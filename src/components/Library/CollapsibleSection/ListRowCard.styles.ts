import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../styles/theme';

const { width } = Dimensions.get('window');

// MATEMÁTICAS EXACTAS:
// Ancho de pantalla (width)
// - 40px (Paddings laterales de la pantalla LibraryScreen)
// - 40px (Paddings internos del contenedor CollapsibleSection)
// - 20px (Dos huecos 'gap' de 10px entre las 3 columnas)
const cardWidth = Math.floor((width - 100) / 3);

export const styles = StyleSheet.create({
    cardContainer: {
        width: cardWidth,
        marginBottom: 5,
    },
    imageContainer: {
        width: cardWidth,
        height: cardWidth, // Cuadrado perfecto
        borderRadius: 12,
        backgroundColor: colors.surface,
        marginBottom: 6,
        // Sombra suave para despegar el disco del panel
        elevation: 4, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 12, // Debe coincidir con imageContainer
    },
    infoContainer: {
        alignItems: 'flex-start',
        paddingHorizontal: 2,
    },
    title: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 2,
    },
    subtitle: {
        color: colors.textMuted,
        fontSize: 11,
    }
});