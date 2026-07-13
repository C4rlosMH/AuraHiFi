import { StyleSheet } from 'react-native';
import { colors, frosted } from '../../../styles/theme';

export const styles = StyleSheet.create({
    overlay: {
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
        paddingTop: 10,
    },
    dragHandleContainer: {
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 10,
    },
    dragHandle: {
        width: 40,
        height: 5,
        backgroundColor: colors.textMuted,
        borderRadius: 3,
        opacity: 0.5,
    },
    headerTitle: {
        color: colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    optionText: {
        color: colors.primary,
        fontSize: 16,
    },
    optionTextActive: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});