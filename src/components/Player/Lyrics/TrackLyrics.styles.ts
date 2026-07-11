import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';


export const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 140,        // Empieza debajo del Header del reproductor
        left: 0,
        right: 0,
        bottom: 250,       // Se extiende hasta el fondo de la pantalla cruzando por DETRÁS del GlassPanel
        
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: 32,
        paddingBottom: '15%',
        //paddingTop: '0%'
    },
    lyricText: {
        fontSize: 30,
        fontWeight: '800',
        lineHeight: 35,  // Mantén el 45 que usamos matemáticamente en el auto-scroll
        //marginBottom: 12,
        marginVertical: 14,
        textAlign: 'left',
    },
    activeText: {
        color: colors.primary,
        opacity: 1,
        //textShadowColor: 'rgba(255,255,255,0.3)',
        textShadowColor: colors.ilumination,
        //textShadowColor: colors.textMuted,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    inactiveText: {
        color: colors.textMuted,
        opacity: 0.3,         
    }
});