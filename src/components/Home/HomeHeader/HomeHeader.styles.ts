import { StyleSheet, Platform } from 'react-native';
import { colors, frosted } from '../../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        top: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 25,
        width: '100%',
        height: 50, // Altura fija idéntica a LibraryHeader
        marginTop: Platform.OS === 'android' ? 40 : 10,
    },
    profileContainer: {
        width: 48,
        height: 48,
        borderRadius: '100%', // Círculo perfecto
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
    },
    profilePic: {
        width: '100%',
        height: '100%',
    },
    centerSpace: {
        flex: 1,
    },
    iconButton: {
        ...frosted,
        padding: 10,
        borderRadius: 21,
        backgroundColor: colors.glassDark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconColor: {
        color: colors.primary,
    },
    logoContainer: {
        flex: 1, // Toma todo el espacio central
        alignItems: 'center', // Centra el logo horizontalmente
        justifyContent: 'center', // Centra el logo verticalmente
    },
    logoImage: {
        width: 100, // Ajusta este ancho según cómo quieras que se vea en pantalla
        height: 64,  // Ajusta este alto proporcionalmente
    },
});