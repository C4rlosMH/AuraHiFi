import { StyleSheet } from 'react-native';
import { colors, frosted } from '../../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        ...frosted, // 🚀 Tu efecto Aura Frosted limpio
        position: 'absolute',
        bottom: 150,
        left: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 21,
        paddingVertical: 16,
        zIndex: 99999,
        elevation: 10,
        borderWidth: 1,
        borderColor: colors.border,
    },
    fusionBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    btnIcon: {
        color: colors.light,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    btnText: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: '600',
    }
});