import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../styles/theme';

const { width } = Dimensions.get('window');

// Matemáticas idénticas: 40px (paddings) + 20px (gaps) = 60px
export const cardWidth = Math.floor((width - 60) / 3);

export const styles = StyleSheet.create({
    container: {
        marginBottom: 30,
        paddingTop: 10,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    artistCard: {
        width: cardWidth,
        marginBottom: 20,
        alignItems: 'center', // Centra el texto debajo del círculo
    },
    imageContainer: {
        width: cardWidth,
        height: cardWidth,
        borderRadius: cardWidth / 2, // 🚀 LA MAGIA: Mitad del ancho = Círculo perfecto
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        
        // Borde y sombra para dar volumen al círculo
        borderWidth: 1,
        borderColor: colors.glassDark,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 5,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: cardWidth / 2, // Debe coincidir con el contenedor
    },
    name: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: '700',
        textAlign: 'center',
        paddingHorizontal: 4,
    }
});