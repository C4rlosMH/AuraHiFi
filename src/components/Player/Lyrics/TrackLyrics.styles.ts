import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';


export const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 120,        // Empieza debajo del Header del reproductor
        left: 0,
        right: 0,
        bottom: 250,       // Se extiende hasta el fondo de la pantalla cruzando por DETRÁS del GlassPanel
        // ❌ ELIMINADO TOTALMENTE EL zIndex: -1
    },
    scrollContent: {
        paddingHorizontal: 32,
    },
    lyricText: {
        fontSize: 22,
        fontWeight: '600',
        lineHeight: 45,  // Mantén el 45 que usamos matemáticamente en el auto-scroll
        marginBottom: 12,
        textAlign: 'center',
    },
    activeText: {
        color: colors.primary,
    },
    inactiveText: {
        color: colors.textMuted,
    }
});