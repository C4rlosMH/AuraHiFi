import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 15,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Esto es vital: obliga a los elementos a bajar a la siguiente línea
        justifyContent: 'space-between',
    }
});