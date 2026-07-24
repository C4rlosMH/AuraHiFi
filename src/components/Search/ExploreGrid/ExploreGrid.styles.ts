import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../styles/theme'; 

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 40 - 15) / 2; 

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    card: {
        width: ITEM_WIDTH,
        height: 100,
        borderRadius: 8,
        padding: 12,
        overflow: 'hidden', 
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    listContent: {
        paddingBottom: 120,
    }
});