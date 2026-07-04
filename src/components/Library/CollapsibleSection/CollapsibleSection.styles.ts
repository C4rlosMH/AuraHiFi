import { StyleSheet } from 'react-native';
import { frosted } from '../../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        ...frosted,
        padding: 20,
        borderRadius: 24,
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 5, 
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: 'rgba(255, 255, 255, 0.9)',
    },
    content: {
        marginTop: 15,
        // --- LA MAGIA DEL GRID AUTOMÁTICO ---
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10, // La separación entre las carátulas
        overflow: 'hidden',
    }
});