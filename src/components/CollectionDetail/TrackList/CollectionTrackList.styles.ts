import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1, 
        //paddingBottom: 15,
        // 🚀 Quitamos el padding horizontal de aquí para no aplastar la Portada (Header)
    },
    listContent: {
        //paddingTop: 15,
        paddingBottom: 140, // 🚀 Espacio al fondo movido aquí (sin estilos en línea)
    },
    trackWrapper: {
        paddingTop: 10,
        paddingHorizontal: 20, // 🚀 El padding lateral ahora envuelve solo a las canciones
    },
    trackRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    trackNumber: {
        width: 30, 
        fontSize: 16,
        color: colors.textMuted,
        fontWeight: '600',
    },
    trackInfo: {
        flex: 1, 
        justifyContent: 'center',
    },
    trackTitle: {
        fontSize: 16,
        color: colors.primary, 
        fontWeight: '500',
        marginBottom: 4,
    },
    trackArtist: {
        fontSize: 14,
        color: colors.textMuted,
    },
    optionsButton: {
        padding: 5,
        marginLeft: 10,
    },
    addAction: {
        backgroundColor: colors.light, 
        justifyContent: 'center',
        alignItems: 'flex-start', 
        paddingLeft: 25,
        marginBottom: 8, 
        borderRadius: 8,
        flex: 1,
    },
    addActionIcon: {
        color: colors.surface, 
    },
    coverArt:{
        width: 44,
        height: 44,
        borderRadius: 6,
        marginRight: 12,
    }
});