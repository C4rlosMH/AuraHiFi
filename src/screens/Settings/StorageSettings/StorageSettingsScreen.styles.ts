import { StyleSheet } from 'react-native';
import { colors, frosted } from '../../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1, // Permite que el AuraBackground se vea
    },
    scrollContent: {
        paddingTop: 10,
        paddingBottom: 60,
    },
    headerInfo: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    headerSubtitle: {
        color: colors.textMuted,
        fontSize: 13,
        fontWeight: '500',
        lineHeight: 20,
    },
    mainRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    legendContainer: {
        flex: 1,
        justifyContent: 'flex-end', // Alinea la lista hacia la base del cilindro
        paddingBottom: 10,
    },
    legendItem: {
        marginBottom: 18,
    },
    legendHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    colorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    legendTitle: {
        color: colors.textMuted,
        fontSize: 13,
    },
    legendSizeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 18,
    },
    legendSize: {
        color: colors.primary,
        fontSize: 18,
        fontWeight: '600',
    },
    chevron: {
        color: colors.textMuted,
        fontSize: 18,
    },
    // --- BOTONES Y PANELES ESTILO AURA ---
    buttonContainer: {
        paddingHorizontal: 20,
    },
    dangerButton: {
        ...frosted,
        backgroundColor: 'rgba(255, 59, 48, 0.15)', // Rojo translúcido
        borderColor: 'rgba(255, 59, 48, 0.3)',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    dangerText: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionTitle: {
        color: colors.accent,
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 12,
        marginTop: 10,
    },
    actionBlock: {
        ...frosted,
        backgroundColor: colors.glassDark,
        borderRadius: 24,
        overflow: 'hidden',
    },
    actionRow: {
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionRowText: {
        color: colors.primary,
        fontSize: 15,
        fontWeight: '500',
    }
});