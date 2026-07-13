import { StyleSheet } from 'react-native';
import { colors, frosted } from '../../../styles/theme';

export const styles = StyleSheet.create({
    container: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 10, // Menos separación para que quepan bien a la derecha
    },
    playButton: { 
        backgroundColor: colors.light, 
        width: 48, // 🚀 Ajustados a 48px para armonizar dentro del panel
        height: 48,
        borderRadius: 24, 
        justifyContent: 'center', 
        alignItems: 'center',
        elevation: 4,
        shadowColor: colors.light,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    iconButton: { 
        ...frosted, 
        width: 44, // 🚀 Ligeramente más pequeño que el play
        height: 44, 
        borderRadius: 22, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: colors.glassDark 
    },
    playBtnText: {
        color: colors.black,
        marginLeft: 3,
    },
});