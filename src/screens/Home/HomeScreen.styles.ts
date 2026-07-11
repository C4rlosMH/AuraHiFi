import { StyleSheet } from 'react-native';
import { colors } from '../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingTop: 16,
        paddingBottom: 160, // Protegemos el final del scroll del MiniPlayer y TabBar
    },
    loaderColor: {
        color: colors.light, // Usamos centralizadamente tu color #7B7BEA para el spinner
    }
});