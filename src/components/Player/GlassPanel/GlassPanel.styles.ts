import { StyleSheet, Dimensions } from 'react-native';

// Extraemos el ancho de la pantalla, igual que en tu AlbumArtwork
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    panelContainer: {
        borderRadius: 30,
        overflow: 'hidden', 
        
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',     // El contorno general casi invisible
        
        borderTopWidth: 1.2,
        borderTopColor: 'rgba(255, 255, 255, 0.18)',  // El "golpe" de luz intenso arriba
        
        borderLeftWidth: 1.3,
        borderLeftColor: 'rgba(255, 255, 255, 0.06)',  // Caída de luz lateral más suave
        
        // 📐 ALINEACIÓN MATEMÁTICA PERFECTA
        width: width * 0.85,     // Mismo ancho exacto que tu portada (85%)
        alignSelf: 'center',     // Lo forzamos al centro para que encaje como bloque
        marginBottom: 20,        // Separación inferior
        
        backgroundColor: 'rgba(15, 15, 15, 0.25)', 
    },
    contentContainer: {
        paddingVertical: 22,
        paddingHorizontal: 20,
    }
});