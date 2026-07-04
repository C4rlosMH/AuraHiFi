import { StyleSheet } from 'react-native';
import { colors, frosted } from '../../../styles/theme';

export const styles = StyleSheet.create({
    fab: {
        ...frosted,
        position: 'absolute',
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30, 
        justifyContent: 'center',
        alignItems: 'center',
        
        // 🚀 ESTRICTAMENTE DESDE EL THEME.TS (Cero rgba manual)
        borderColor: colors.border, 
        borderWidth: 1,
        
        shadowColor: colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    }
});