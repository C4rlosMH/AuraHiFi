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
        ... frosted,
        backgroundColor: colors.reemplazo,
        //borderTopLeftRadius: 24,
        //borderTopRightRadius: 24,
        paddingBottom: 30,
        maxHeight: height * 0.7, 
    },
    dragHandleContainer: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    dragHandle: {
        width: 40,
        height: 5,
        backgroundColor: colors.textMuted,
        borderRadius: 3,
        opacity: 0.5,
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        color: colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    loaderContainer: {
        padding: 40,
        alignItems: 'center',
    },
    listContent: {
        paddingVertical: 8,
    },
    playlistRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    coverArt: {
        width: 50,
        height: 50,
        borderRadius: 6,
        backgroundColor: colors.surface,
    },
    coverArtPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 6,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playlistInfo: {
        marginLeft: 16,
        flex: 1,
    },
    playlistTitle: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    playlistTracks: {
        color: colors.textMuted,
        fontSize: 13,
    }
});