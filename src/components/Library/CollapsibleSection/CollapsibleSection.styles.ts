import { StyleSheet } from 'react-native';
import { colors, frosted } from '../../../styles/theme';

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
        paddingBottom: 10, // Un poco de espacio antes de las listas
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: 'rgba(255, 255, 255, 0.9)',
    },
    content: {
        marginTop: 10,
        overflow: 'hidden',
    }
});