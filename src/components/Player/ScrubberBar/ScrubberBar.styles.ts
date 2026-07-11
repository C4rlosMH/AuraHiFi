import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

export const styles = StyleSheet.create({
    progressContainer: {
        width: '100%',
        paddingVertical: 10, 
    },
    // 🧲 HITBOX INVISIBLE: Mide 30px de alto para que sea fácil de tocar, 
    // pero las líneas visuales adentro serán muy finas.
    sliderTrackContainer: {
        width: '100%',
        height: 30, 
        justifyContent: 'center', // Centra verticalmente las líneas
        position: 'relative',
    },
    trackBackground: {
        position: 'absolute',
        width: '100%',
        height: 3, // 🚀 LÍNEA ULTRA FINA
        backgroundColor: 'rgba(255, 255, 255, 0.15)', // Fondo cristalino
        borderRadius: 2,
    },
    trackProgress: {
        position: 'absolute',
        height: 3, // 🚀 MISMO GROSOR
        backgroundColor: colors.primary, // El color de acento de tu tema
        borderRadius: 2,
        left: 0,
    },
    thumb: {
        position: 'absolute',
        width: 6, // 🚀 PUNTO PEQUEÑO (Estilo Apple)
        height: 6,
        borderRadius: 5,
        backgroundColor: colors.primary,
        
        // El thumb se posiciona usando 'left' en %, pero necesitamos restarle
        // la mitad de su tamaño para que su CENTRO quede exactamente en la línea.
        transform: [{ translateX: -5 }], 
        
        // 🌟 EL BRILLO / GLOW
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1, // Intensidad del brillo
        shadowRadius: 5,  // Qué tan lejos llega el resplandor
        elevation: 6,     // Brillo en Android
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -4, // Sube ligeramente los números para que se sientan parte de la barra
        paddingHorizontal: 2,
    },
    timeText: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
        fontVariant: ['tabular-nums'], // 🚀 CRÍTICO: Evita que los números tiemblen cuando avanzan los segundos
    }
});