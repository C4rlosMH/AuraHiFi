import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../styles/theme';

const { width } = Dimensions.get('window');
// Matemáticas: Ancho total - 40px (padding pantalla) - 20px (dos espacios de gap de 10px) = Dividido entre 3
const cardWidth = Math.floor((width - 60) / 3);

export const styles = StyleSheet.create({
    cardContainer: {
        width: cardWidth,
        marginBottom: 16, // Espacio para separar visualmente las filas hacia abajo
    },
    imageContainer: {
        width: cardWidth,
        height: cardWidth, // Forzamos a que solo la imagen sea el cuadrado perfecto
        borderRadius: 12,
        backgroundColor: colors.surface,
        marginBottom: 8, // Separación limpia entre la imagen y el texto
        
        // Sutil brillo exterior para dar aspecto premium a la carátula
        borderWidth: 1,
        borderColor: colors.glassDark,
        
        // Sombra para despegar el disco del fondo oscuro de la app
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 11, // Ligeramente menor para encajar perfecto en el borde
    },
    pinBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        //backgroundColor: colors.accent, // Círculo del color de acento
        borderRadius: 12,
        padding: 4,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
    },
    infoContainer: {
        alignItems: 'flex-start',
        paddingHorizontal: 2, // Para que el texto alinee sutilmente con el borde de la carátula
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