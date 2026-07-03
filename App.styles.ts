import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
        paddingTop: 60,
        paddingHorizontal: 20
    },
    centerContainer: {
        flex: 1,
        backgroundColor: '#0a0a0a',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#00ffcc',
        letterSpacing: 2,
        marginBottom: 20
    },
    loadingText: {
        color: '#888',
        marginTop: 15,
        fontSize: 14
    },
    listContainer: {
        paddingBottom: 120
    },
    emptyText: {
        color: '#444',
        textAlign: 'center',
        marginTop: 40
    },
    trackCard: {
        flexDirection: 'row',
        backgroundColor: '#121212',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12
    },
    coverImage: {
        width: 50,
        height: 50,
        borderRadius: 4,
        backgroundColor: '#222'
    },
    trackInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center'
    },
    trackTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
    trackArtist: {
        color: '#888',
        fontSize: 12,
        marginTop: 4
    },
    miniPlayer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#00ffcc'
    },
    miniPlayerInfo: {
        flex: 1,
        paddingRight: 10
    },
    miniPlayerTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold'
    },
    miniPlayerStatus: {
        color: '#00ffcc',
        fontSize: 10,
        marginTop: 4,
        textTransform: 'uppercase'
    },
    playButton: {
        backgroundColor: '#00ffcc',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20
    },
    playButtonText: {
        color: '#0a0a0a',
        fontSize: 12,
        fontWeight: 'bold'
    },
    // Nuevas reglas para el botón de Favoritos
    likeButton: {
        padding: 10,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    likeText: {
        color: '#00ffcc',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1
    },
    miniPlayerContainer: {
        position: 'absolute',
        bottom: 75, // <-- CLAVE: Lo elevamos justo por encima del Navbar (65px) + 10px de margen
        left: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(30, 30, 30, 0.95)',
        padding: 10,
        borderRadius: 12,
        // (mantén los estilos de bordes o sombras que ya tenías)
    },
});