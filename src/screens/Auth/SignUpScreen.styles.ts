import { StyleSheet, Dimensions } from 'react-native';
import { colors, frosted } from '../../styles/theme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 30,
        width: '100%',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textMuted,
        textAlign: 'center',
    },
    frostedCard: {
        ...frosted,
        width: '100%',
        padding: 30,
        backgroundColor: colors.glassDark,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        color: colors.textMuted,
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: colors.cycle,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 52,
        color: colors.primary,
        fontSize: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    signupButton: {
        backgroundColor: colors.primary,
        height: 52,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    signupButtonText: {
        color: colors.background,
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    switchModeButton: {
        marginTop: 24,
        alignItems: 'center',
    },
    switchModeText: {
        color: colors.textMuted,
        fontSize: 14,
    },
    switchModeTextBold: {
        color: colors.primary,
        fontWeight: 'bold',
    },
});