import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';

export const styles = StyleSheet.create({
    progressContainer: {
        width: '100%',
        marginBottom: 20,
    },
    sliderTrackContainer: {
        width: '100%', 
        height: 40, 
        justifyContent: 'center'
    },
    trackBackground: {
        height: 4, 
        backgroundColor: colors.progressBg, 
        borderRadius: 2
    },
    trackProgress: {
        position: 'absolute', 
        height: 4, 
        backgroundColor: colors.light, 
        borderRadius: 2,
        left: 0 
    },
    thumb: {
        position: 'absolute', 
        width: 16, 
        height: 16, 
        borderRadius: 8,
        backgroundColor: colors.primary, 
        marginLeft: -8,
        shadowColor: colors.light, 
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5 
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        paddingHorizontal: 15,
    },
    timeText: {
        color: colors.textMuted,
        fontSize: 12,
        fontWeight: '600',
    },
});