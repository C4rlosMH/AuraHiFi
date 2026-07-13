import { StyleSheet, Dimensions } from 'react-native';
import { colors, frosted } from '../../../styles/theme'; // 🚀 TU DISEÑO MAESTRO DE CRISTAL

const SCREEN_HEIGHT = Dimensions.get('window').height;

export const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'transparent', 
    },
    bottomSheet: {
        ...frosted, // 🚀 APLICANDO TU ESTÁNDAR FROSTED NATIVO
        backgroundColor: colors.reemplazo,
        
        // Adaptamos la caja para que se pegue al fondo de la pantalla como un BottomSheet
        //borderTopLeftRadius: 24,
        //borderTopRightRadius: 24,
        //borderBottomLeftRadius: 0, 
        //borderBottomRightRadius: 0,
        //borderBottomWidth: 0, 
        
        paddingTop: 10,
        paddingHorizontal: 20,
        paddingBottom: 40,
        maxHeight: SCREEN_HEIGHT * 0.85,
    },
    dragHandleContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    dragHandle: {
        width: 40,
        height: 5,
        backgroundColor: colors.drag, 
        borderRadius: 3,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)', 
        paddingBottom: 15,
        gap: 15,
    },
    coverArt: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: colors.glassDark,
    },
    coverArtPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: colors.glassDark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTextContainer: {
        flex: 1,
    },
    trackTitle: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    trackArtist: {
        color: colors.textMuted,
        fontSize: 14,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        gap: 15,
    },
    optionText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '500',
    },
    // ==========================================
    // 🚀 CONTROL CENTRALIZADO DE COLORES DE ÍCONOS
    // ==========================================
    optionIcon: {
        color: colors.primary,
    },
    placeholderIcon: {
        color: colors.textMuted,
    },
    favoriteIconActive: {
        color: colors.accent, // Cian icónico de Aura cuando está encendido
    },
    dangerIcon: {
        color: '#FF3B30', 
    },
    optionTextDanger: {
        color: '#FF3B30', 
    }
});