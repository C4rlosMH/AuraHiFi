import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 15,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10, // Mismo espaciado exacto que PinnedGrid
    }
});