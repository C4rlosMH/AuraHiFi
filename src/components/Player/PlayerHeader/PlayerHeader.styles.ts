import { StyleSheet, Platform } from 'react-native';
// 🔗 IMPORTACIÓN DIRECTA: Traemos 'frosted' de manera independiente
import { frosted } from '../../../styles/theme'; 

export const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: 30,
        marginTop: Platform.OS === 'android' ? 15 : 0, 
        width: '100%',
    },
    // 💎 EL BOTÓN LATERAL HEREDA EL CRISTAL DE FORMA DIRECTA
    frostedButton: {
        ...frosted, // ⚡ Inyectamos las propiedades del cristal esmerilado
        width: 42,
        height: 40,
        borderRadius: 14, // Forzamos un radio más cerrado para botones pequeños
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyCenter: {
        flex: 1,
    },
    // 💎 LA CÁPSULA CENTRAL TAMBIÉN SE VUELVE DE VIDRIO
    metaContextContainer: {
        ...frosted, // ⚡ Reutilizamos el mismo bloque de física de luz
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 18,
        marginHorizontal: 12,
    },
    miniArtwork: {
        width: 32,
        height: 34,
        borderRadius: 8,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    contextTitle: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    contextArtist: {
        color: 'rgba(255, 255, 255, 0.45)',
        fontSize: 11,
        fontWeight: '400',
        marginTop: 1,
    },
});