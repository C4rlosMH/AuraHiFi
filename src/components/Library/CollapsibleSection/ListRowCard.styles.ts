import { StyleSheet } from 'react-native';
import { colors, frosted } from '../../../styles/theme';

export const styles = StyleSheet.create({
    cardContainer: {
        // Le damos un efecto cristalino sutil a cada fila
        ...frosted,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 12,
        marginBottom: 10,
    },
    imageContainer: {
        width: 60,
        height: 60,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: colors.surface,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'center',
    },
    title: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    subtitle: {
        color: colors.textMuted,
        fontSize: 12,
        fontWeight: '500',
    },
    rightAction: {
        padding: 10,
    }
});