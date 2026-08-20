import { StyleSheet, Dimensions } from 'react-native';
import { colors, frosted } from '../../../styles/theme';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        ...frosted,
        backgroundColor: colors.reemplazo,
        paddingBottom: 40,
        paddingTop: 12,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: height * 0.85,
    },
    dragHandleContainer: {
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 5,
    },
    dragHandle: {
        width: 40,
        height: 5,
        backgroundColor: colors.textMuted,
        borderRadius: 3,
        opacity: 0.5,
    },
    headerContainer: {
        alignItems: 'baseline',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        color: colors.primary,
        justifyContent: 'flex-start',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        color: colors.textMuted,
        fontSize: 14,
    },
    // --- BOTÓN PRINCIPAL DE JAM ---
    hostCard: {
        marginHorizontal: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginBottom: 25,
    },
    hostTextContainer: {
        flex: 1,
        marginRight: 15,
    },
    hostTitle: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    hostSubtitle: {
        color: colors.textMuted,
        fontSize: 13,
    },
    hostButton: {
        backgroundColor: colors.light,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    hostButtonText: {
        color: colors.background,
        fontSize: 14,
        fontWeight: 'bold',
    },
    // --- LISTA DEL ESCÁNER ---
    sectionTitle: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.glassDark,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.glassBadge,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    eqOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    displayName: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    trackMeta: {
        color: colors.textMuted,
        fontSize: 13,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 8,
        marginLeft: 10,
    },
    actionBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: colors.glassDark,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    actionBtnPrimary: {
        backgroundColor: colors.light,
        borderColor: colors.light,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 20,
    },
    emptyText: {
        color: colors.textMuted,
        marginTop: 10,
        fontSize: 14,
        textAlign: 'center',
    }
});