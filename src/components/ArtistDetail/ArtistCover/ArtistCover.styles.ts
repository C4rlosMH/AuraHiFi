import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        width: width,
        height: width, // 🚀 Cuadrado perfecto edge-to-edge que llena la pantalla horizontalmente
        backgroundColor: '#0a0a0a',
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
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
    }
});