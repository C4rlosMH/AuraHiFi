import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

export const styles = StyleSheet.create({
    cardContainer: {
        width: '48%', // Permite 2 columnas con un pequeño espacio en medio
        aspectRatio: 1, // La hace un cuadrado perfecto
        borderRadius: 16,
        overflow: 'hidden', // Evita que la imagen se salga de los bordes redondeados
        marginBottom: 15,
        backgroundColor: colors.surface,
        
        // Sutil brillo exterior para dar aspecto de cristal/premium
        borderWidth: 1,
        borderColor: colors.glassDark,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-end', // Empuja los textos hacia abajo
        padding: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.45)', // Oscurece la imagen para que el texto sea legible
    },
    pinIcon: {
        marginBottom: 4,
        // Sombra en el icono para que resalte sobre cualquier portada clara
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    title: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '700',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    subtitle: {
        color: colors.textMuted,
        fontSize: 11,
        marginTop: 2,
        fontWeight: '500',
    },
});