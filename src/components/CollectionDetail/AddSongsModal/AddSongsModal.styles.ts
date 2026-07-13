import { StyleSheet } from 'react-native';
import { colors, frosted } from '../../../styles/theme';

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
    },
    sheetContainer: {
        ...frosted,
        backgroundColor: colors.reemplazo,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        height: '80%', // Suficiente espacio para la lista
        paddingTop: 12,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    dragIndicator: {
        width: 40,
        height: 5,
        backgroundColor: colors.textMuted,
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        color: colors.primary,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: colors.glassDark,
        borderRadius: 12,
        padding: 4,
        marginBottom: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: colors.light,
    },
    tabText: {
        color: colors.textMuted,
        fontSize: 14,
        fontWeight: '600',
    },
    activeTabText: {
        color: colors.primary,
    },
    trackRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    trackInfo: {
        flex: 1,
        marginLeft: 12,
    },
    trackTitle: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    trackArtist: {
        color: colors.textMuted,
        fontSize: 13,
    },
    actionsContainer: {
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    addButton: {
        backgroundColor: colors.light,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    addButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.4,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: 40,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginHorizontal: 20,
        marginBottom: 15,
        height: 46,
    },
    searchInput: {
        flex: 1,
        color: colors.primary,
        fontSize: 16,
        marginLeft: 10,
    },
});