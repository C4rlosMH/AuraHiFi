import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    artworkContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    albumArtwork: {
        width: width * 0.85,
        height: width * 0.85,
        borderRadius: 20,
    },
});