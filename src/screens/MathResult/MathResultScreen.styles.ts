import { StyleSheet } from 'react-native';
import { colors, frosted } from '../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    summaryCard: {
        ...frosted,
        marginHorizontal: 10,
        marginTop: 110,
        marginBottom: 20,
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        color: colors.primary,
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 6,
    },
    subtitle: {
        color: colors.textMuted,
        fontSize: 14,
        textAlign: 'center',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginTop: 20,
        width: '100%',
    },
    actionButton: {
        flex: 1, // Para que ambos botones midan lo mismo
        backgroundColor: colors.glassDark,
        borderRadius: 14,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    playButton: {
        backgroundColor: colors.light,
        borderColor: colors.light,
    },
    buttonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    playButtonText: {
        color: colors.black, 
    }
});