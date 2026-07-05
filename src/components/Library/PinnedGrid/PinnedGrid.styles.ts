import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        marginBottom: 0,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 15,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Esto es vital: obliga a los elementos a bajar a la siguiente línea
        gap: 10,
    }
});