import { StyleSheet, Dimensions } from 'react-native';
import { frosted } from '../../../styles/theme'; // 🚀 Importamos tu diseño centralizado

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    panelContainer: {
        ...frosted,                // 🚀 Aplicamos toda tu magia esmerilada del theme.ts
        width: width * 0.85,       
        alignSelf: 'center',
        borderRadius: 21,          
        marginBottom: 15,          
        overflow: 'hidden',        // Mantiene el contenido respetando los bordes curvos
    },
    contentContainer: {
        paddingVertical: 12,
        paddingHorizontal: 15,
    }
});