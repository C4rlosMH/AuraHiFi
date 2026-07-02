import { StyleSheet, Dimensions } from 'react-native';

// Extraemos el ancho de la pantalla, igual que en tu AlbumArtwork
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    panelContainer: {
        borderRadius: 30,
        overflow: 'hidden', 
        
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.03)',
        borderTopWidth: 1.5,
        borderTopColor: 'rgba(255, 255, 255, 0.22)',
        borderLeftWidth: 1.2,
        borderLeftColor: 'rgba(255, 255, 255, 0.08)',
        // 📐 ALINEACIÓN MATEMÁTICA PERFECTA
        width: width * 0.85,     // Mismo ancho exacto que tu portada (85%)
        alignSelf: 'center',     // Lo forzamos al centro para que encaje como bloque
        marginBottom: 15,        // Separación inferior
        
        backgroundColor: 'rgba(15, 15, 15, 0.35)',
    },
    contentContainer: {
        paddingVertical: 20,
        paddingHorizontal: 20,
    }
});