import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';
export const styles = StyleSheet.create({
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 10,
    },
    footerAction: {
        padding: 10,
    },
    activeTuneBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.light, // Tu color cyan brillante
        borderWidth: 2,
        borderColor: colors.background, // Para que "corte" el ícono de abajo
    }
});