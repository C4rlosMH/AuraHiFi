import { StyleSheet } from 'react-native';
import { colors, frosted } from '../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centerContainer: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 160, // Espacio vital para el MiniPlayer
    },
    
    // --- Header ---
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
        borderRadius: 20, // Circular
    },

    // --- Filtros ---
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
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        gap: 6,
    },
    filterChipText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },

    // --- Grilla de Pins (2 Columnas) ---
    sectionTitle: { 
        fontSize: 18,
        fontWeight: '700',
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 15,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    pinCard: {
        width: '48%', // Ligeramente menos del 50% para el margen central
        aspectRatio: 1, // Cuadrado perfecto
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 15,
        backgroundColor: colors.surface,
    },
    pinImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    pinOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Oscurecido para que el texto sea legible
    },
    pinIcon: {
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    pinTitle: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '700',
    },
    pinSubtitle: {
        color: colors.textMuted,
        fontSize: 11,
        marginTop: 2,
    },

    // --- Recientemente Añadido ---
    recentContainer: {
        ...frosted,
        padding: 20,
        borderRadius: 24,
    },
    recentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    recentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    recentImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    recentInfo: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'center',
    },
    recentTitle: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    recentSubtitle: {
        color: colors.textMuted,
        fontSize: 12,
    },
    moreButton: {
        padding: 10,
    }
});