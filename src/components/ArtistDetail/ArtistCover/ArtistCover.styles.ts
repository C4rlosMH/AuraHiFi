import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../styles/theme';


const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        width: width,
        height: width, // 🚀 Cuadrado perfecto edge-to-edge que llena la pantalla horizontalmente
        backgroundColor: colors.background,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    fallbackContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.surface,
    }
});