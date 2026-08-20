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
        backgroundColor: colors.activity,
        paddingBottom: 40,
        paddingTop: 12,
        maxHeight: height * 0.85,
    },
    dragHandleContainer: {
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 10,
    },
    dragHandle: {
        width: 40,
        height: 5,
        backgroundColor: colors.textMuted,
        borderRadius: 3,
        opacity: 0.5,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        color: colors.primary,
        fontSize: 22,
        fontWeight: 'bold',
    },
    subtitle: {
        color: colors.light, // Color cyán para que destaque
        fontSize: 14,
        fontWeight: '600',
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
        width: 50,
        height: 50,
        borderRadius: 25,
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
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
        marginTop: 40,
    },
    emptyText: {
        color: colors.textMuted,
        marginTop: 10,
        fontSize: 14,
    }
});