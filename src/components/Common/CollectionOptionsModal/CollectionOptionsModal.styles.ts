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
        ...frosted, // 🚀 APLICANDO TU ESTÁNDAR FROSTED NATIVO
        backgroundColor: colors.reemplazo,
        /* borderTopLeftRadius: 24,
        borderTopRightRadius: 24, */
        paddingBottom: 30,
        maxHeight: height * 0.85,
    },
    dragHandleContainer: {
        alignItems: 'center',
        paddingVertical: 12,
        /* backgroundColor: colors.drag, 
        borderRadius: 3, */
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
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.glassDark,
        alignItems: 'center',
    },
    coverArt: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: colors.surface,
    },
    coverArtPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderIcon: {
        color: colors.textMuted,
    },
    headerTextContainer: {
        marginLeft: 15,
        flex: 1,
        justifyContent: 'center',
    },
    collectionTitle: {
        color: colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    collectionSubtitle: {
        color: colors.textMuted,
        fontSize: 14,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    optionIcon: {
        color: colors.primary,
        marginRight: 15,
    },
    pinIconActive: {
        color: colors.primary,
        marginRight: 15,
    },
    optionText: {
        color: colors.primary,
        fontSize: 16,
    }
});