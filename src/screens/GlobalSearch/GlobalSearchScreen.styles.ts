import { StyleSheet } from 'react-native';
import { colors } from '../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    header: {
        paddingTop: 50, 
        paddingBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
        marginTop: 25,
        marginBottom: 10,
        backgroundColor: 'transparent',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
    }
});