import { StyleSheet, Dimensions } from 'react-native';
import { colors, frosted } from '../../../styles/theme';


// Extraemos el ancho de la pantalla, igual que en tu AlbumArtwork
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    panelContainer: {
        ...frosted,
        borderRadius: 21,
        overflow: 'hidden', 
        // 📐 ALINEACIÓN MATEMÁTICA PERFECTA
        width: width * 0.85,     // Mismo ancho exacto que tu portada (85%)
        alignSelf: 'center',     // Lo forzamos al centro para que encaje como bloque
        marginBottom: 15,        // Separación inferior
        
    },
    contentContainer: {
        paddingVertical: 20,
        paddingHorizontal: 20,
    }
});