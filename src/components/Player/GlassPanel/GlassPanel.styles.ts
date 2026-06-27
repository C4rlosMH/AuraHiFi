import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    panelContainer: {
        borderRadius: 35,
        padding: 20, 
        overflow: 'hidden', 
        
        // Brillo fisico del cristal
        backgroundColor: 'rgba(255, 255, 255, 0.02)', 
        borderWidth: 1.5, 
        borderColor: 'rgba(255, 255, 255, 0.25)', 
        
        marginTop: 15,
        marginBottom: 15, 
    },
    contrastOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.10)', 
    }
});