import { StyleSheet, Platform } from 'react-native';
import { colors, frosted } from '../../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 50 : 20,
        paddingBottom: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },
    backButton: {
        ...frosted,
        width: 42,
        height: 40,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBackShift: {
        marginRight: 2,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
        letterSpacing: 0.5,
    },
    rightSpacer: {
        width: 42, // Mismo ancho que el botón para mantener el título perfectamente centrado
    }
});