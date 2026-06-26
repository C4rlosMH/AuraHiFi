// src/components/GlassPanel/GlassPanel.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    panelContainer: {
        borderRadius: 35,
        padding: 20, 
        overflow: 'hidden', 
        backgroundColor: 'rgba(255, 255, 255, 0.03)', // Brillo base en la cara del cristal
        borderWidth: 1.5, 
        borderColor: 'rgba(255, 255, 255, 0.15)', // Luz reflejada en los cantos del cristal (iOS 17 Look)
        marginTop: 15,
        marginBottom: 15, 
    },
    lensWrapper: {
        ...StyleSheet.absoluteFillObject,
    },
    lensImage: {
        ...StyleSheet.absoluteFillObject,
        transform: [
            { scale: 1.4 },       // Zoom del cristal líquido transparente
            { translateX: -20 },  // Desfase de refracción horizontal
            { translateY: 20 }    // Desfase de refracción vertical
        ],
        opacity: 0.9,
    },
    contrastOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.15)', // Filtro para garantizar lectura de textos blancos
    }
});