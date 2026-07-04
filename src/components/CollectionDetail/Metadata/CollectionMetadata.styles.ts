import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme'; 

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 20, // Espacio entre la foto gigante y el texto
        paddingBottom: 5,
    },
    title: {
        fontSize: 26, 
        fontWeight: 'bold',
        color: colors.primary, // Corregido: Ahora usa el blanco puro (#ffffff) de tu theme
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 18,
        color: colors.accent, // El verde aqua de acento (#00ffcc)
        fontWeight: '600',
        opacity: 0.9,
    }
});