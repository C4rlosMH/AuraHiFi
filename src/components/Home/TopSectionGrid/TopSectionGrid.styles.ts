// src/components/Home/TopSectionGrid/TopSectionGrid.styles.ts
import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 10,
    },
    scrollContent: {
        alignItems: 'stretch', // 🚀 Hace que la página del reproductor tome la misma altura exacta que la del grid
    },
    pageContainer: {
        paddingHorizontal: 20, 
        justifyContent: 'center',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%', // 🚀 Usa todo el ancho de la página
        justifyContent: 'space-between', // 🚀 Empuja una tarjeta a la izq y otra a la der
        rowGap: 12, // 🚀 Solo separa verticalmente, el espacio horizontal es automático
    },
    resumeWrapper: {
        flex: 1, // 🚀 Crece para igualar la altura de la página mágicamente
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        gap: 8,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.textMuted,
        opacity: 0.5,
    },
    activeDot: {
        width: 12,
        backgroundColor: colors.light,
        opacity: 1,
    }
});