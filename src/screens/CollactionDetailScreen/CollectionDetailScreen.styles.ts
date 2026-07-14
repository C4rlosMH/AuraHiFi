import { StyleSheet } from 'react-native';
import { colors } from '../../styles/theme';


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    flatTextBackground: {
        width: '100%', 
        backgroundColor: colors.reemplazo, 
        paddingTop: 10,
        paddingBottom: 15, // 🚀 Aumentamos a 25px para empujar la primer canción hacia abajo (10 + los 15 originales)
    },
    searchBarContainer: {
        paddingTop: 50,
        paddingBottom: 10,
    },
});