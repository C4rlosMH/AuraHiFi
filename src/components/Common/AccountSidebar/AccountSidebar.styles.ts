import { StyleSheet, Dimensions } from 'react-native';
import { colors, frosted } from '../../../styles/theme';

const { width, height } = Dimensions.get('window');
// El sidebar ocupará el 80% del ancho de la pantalla
const SIDEBAR_WIDTH = width * 0.8;

export const styles = StyleSheet.create({
    overlayContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999, // Asegura que esté por encima de todo
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'transparent', // El oscurecimiento lo maneja el Animated.View
    },
    sidebarContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: SIDEBAR_WIDTH,
        height: height,
        // En lugar de usar el 'reemplazo' gris, usamos un cristal mucho más profundo
        //backgroundColor: 'rgba(5, 5, 10, 0.85)', 
        backgroundColor: colors.so_dark, 
        borderRightWidth: 1,
        borderRightColor: 'rgba(255, 255, 255, 0.05)',
        paddingTop: 60, // Espacio para la barra de estado
        paddingHorizontal: 20,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 35,
        paddingBottom: 25,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    profilePic: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: colors.border,
    },
    profileInfo: {
        marginLeft: 15,
        flex: 1,
        justifyContent: 'center',
    },
    profileName: {
        color: colors.primary,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    serverInfo: {
        color: colors.textMuted,
        fontSize: 13,
        fontWeight: '500',
    },
    menuList: {
        flex: 1,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        gap: 16,
    },
    optionText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '500',
    },
    optionIcon: {
        color: colors.textMuted, // Iconos atenuados para elegancia
    },
    dangerIcon: {
        color: '#FF3B30',
    },
    optionTextDanger: {
        color: '#FF3B30',
    },
    versionText: {
        color: 'rgba(255, 255, 255, 0.2)',
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 30,
    }
});