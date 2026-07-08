import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    flatTextBackground: {
        width: '100%', // Asegura que cubra todo el ancho horizontal de lado a lado
        backgroundColor: 'rgba(10, 10, 12, 0.45)', // Un tinte oscuro sutil para que resalten las letras
        paddingVertical: 10, // Espaciado interno superior e inferior para equilibrar
    },
    searchBarContainer: {
        paddingTop: 50,
        paddingBottom: 10,
    },
});