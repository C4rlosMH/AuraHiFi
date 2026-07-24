import { StyleSheet } from 'react-native';
import { colors, frosted } from '../../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        ...frosted,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 50,
        marginHorizontal: 20,
        marginTop: 10,
    },
    input: {
        flex: 1,
        color: colors.primary,
        fontSize: 16,
        marginLeft: 10,
    },
    clearButton: {
        padding: 5,
    }
});