import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    centerContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: 2,
        marginTop: 60,
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    listContainer: {
        paddingHorizontal: 15,
        // 🚀 CLAVE: Espacio extra al final para que el Mini-Player y Navbar no tapen la música
        paddingBottom: 160, 
    },
    trackCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(20, 20, 20, 0.8)',
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
    },
    coverImage: {
        width: 55,
        height: 55,
        borderRadius: 8,
    },
    trackInfo: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'center',
    },
    trackTitle: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    trackArtist: {
        color: '#aaaaaa',
        fontSize: 13,
    },
    likeButton: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    likeText: {
        color: '#555555',
        fontSize: 22,
    },
    likeTextActive: {
        color: '#00ffcc', // Tu color accent premium
    }
});