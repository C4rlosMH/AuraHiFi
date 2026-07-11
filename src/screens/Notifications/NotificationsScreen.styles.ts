import { StyleSheet, Platform } from 'react-native';
import { colors, frosted } from '../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    // --- HEADER ---
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 50 : 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.primary,
    },
    headerSpacer: {
        width: 40, // Compensa el tamaño del botón para centrar el texto
    },
    iconColor: {
        color: colors.primary,
    },
    // --- LISTA ---
    scrollContent: {
        padding: 20,
        paddingBottom: 160, // Protege contra el MiniPlayer
        gap: 12,
    },
    card: {
        ...frosted,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.glassDark,
        position: 'relative',
        overflow: 'hidden',
    },
    unreadCard: {
        backgroundColor: 'rgba(123, 123, 234, 0.15)', // Resalta un poco usando tu color Accent si no está leída
        borderColor: 'rgba(123, 123, 234, 0.3)',
    },
    unreadDot: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.light, // #7B7BEA
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    coverImage: {
        width: 48,
        height: 48,
        borderRadius: 8,
    },
    textContainer: {
        flex: 1,
        marginLeft: 14,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary,
        marginBottom: 4,
        paddingRight: 15, // Deja espacio para el puntito de no leído
    },
    message: {
        fontSize: 14,
        color: colors.textMuted,
        marginBottom: 6,
        lineHeight: 20,
    },
    time: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: '500',
    },
    accentColor: {
        color: colors.light,
    },
    // --- EMPTY STATE (Cuando no hay nada) ---
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.primary,
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: colors.textMuted,
        textAlign: 'center',
    },
    mutedColor: {
        color: colors.textMuted,
    }
});