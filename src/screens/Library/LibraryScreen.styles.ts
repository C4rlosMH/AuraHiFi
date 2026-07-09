// src/screens/Library/LibraryScreen.styles.ts

import { StyleSheet } from 'react-native';
import { colors, frosted } from '../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    centerContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 160, 
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.primary,
        letterSpacing: -0.5,
    },
    iconButton: {
        ...frosted,
        padding: 10,
        borderRadius: 20, 
    },
    filterSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    filterChip: {
        ...frosted,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
    },
    filterChipActive: {
        backgroundColor: colors.accent,
        borderColor: colors.accent,
    },
    filterText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
    filterTextActive: {
        color: '#000',
    },
    placeholderContainer: {
        width: '100%',
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
        ...frosted,
        borderRadius: 24,
        marginTop: 20,
    },
    placeholderText: {
        color: colors.textMuted,
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 22,
    },
    placeholderHighlight: {
        color: colors.accent,
        fontWeight: '700',
        fontSize: 16,
        marginBottom: 8,
    },
    sectionWrapper: {
        marginTop: 25,
        width: '100%',
    },
    // 🚀 ESTILOS DEL MODO SELECCIÓN INTEGRADOS AL OBJETO ÚNICO
    selectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
    },
    selectionTitle: {
        color: colors.accent,
        fontSize: 22,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    cancelText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    fusionBar: {
        ...frosted,
        position: 'absolute',
        // 🚀 PRUEBA DE FUEGO: Lo ponemos arriba (top) para descartar que la barra de navegación lo oculte
        top: 150, 
        left: 20,
        right: 20,
        paddingVertical: 18,
        backgroundColor: colors.reemplazo, 
       /*  borderRadius: 24,
        
        borderWidth: 2, */
        //borderColor: colors.light, // Borde morado brillante para que resalte
        zIndex: 99999, // Z-index exagerado
        elevation: 20,
    },
    fusionBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12, // Reduje un poco el padding por si tu pantalla es angosta
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