import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'transparent', 
    },
    content: {
        flex: 1,
        paddingHorizontal: 25,
        paddingTop: 60,
        paddingBottom: 20, 
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
    },
    queueListContainer: {
        flex: 1,
        marginTop: 15,
    },
    headerGestureContainer: {
        width: '100%',
    },
    artworkGestureContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lyricsSpacer: {
        flex: 1,
        width: '100%',
    },
    losslessWrapper: {
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 12, 
            marginBottom: 12,
            height: 28, // Le dimos un poco más de altura para acomodar la burbuja
        },
});