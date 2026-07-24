import { StyleSheet } from 'react-native';
import { colors, frosted } from '../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 150,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backButton: {
        marginRight: 15,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.primary,
    },
    section: {
        marginTop: 30,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 15,
    },
    mixCard: {
        ... frosted,
        width: '100%',
        height: 160,
        borderRadius: 16,
        padding: 20,
        justifyContent: 'flex-end',
        position: 'relative',
        overflow: 'hidden',
    },
    collageContainer: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    collageImage: {
        width: '50%',
        height: '50%',
    },
    darkOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)', 
    },
    mixOverlay: {
        zIndex: 2,
    },
    mixTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary,
    },
    mixSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    playIconContainer: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.light,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        paddingLeft: 4, 
    },
    carousel: {
        overflow: 'visible',
    },
    albumCard: {
        width: 140,
        marginRight: 16,
    },
    albumArt: {
        width: 140,
        height: 140,
        borderRadius: 12,
        marginBottom: 8,
        backgroundColor: colors.surface,
    },
    albumTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 4,
    },
    albumArtist: {
        fontSize: 12,
        color: colors.textMuted,
    },
});