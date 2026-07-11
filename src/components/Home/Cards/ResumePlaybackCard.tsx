import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './ResumePlaybackCard.styles';

interface ResumePlaybackCardProps {
    trackTitle: string;
    artistName: string;
    coverUrl: string;
    isPlaying: boolean;
    onPlayPause: () => void;
    onNext: () => void;
    onPrev: () => void;
    onCardPress: () => void;
}

export default function ResumePlaybackCard({
    trackTitle,
    artistName,
    coverUrl,
    isPlaying,
    onPlayPause,
    onNext,
    onPrev,
    onCardPress,
}: ResumePlaybackCardProps) {
    return (
        <TouchableOpacity 
           /*  style={styles.container}  */
            activeOpacity={0.9} 
            onPress={onCardPress}
        >
            <View style={styles.container}>
                <Text style={styles.headerText}>Continuar escuchando</Text>
                
                <View style={styles.trackInfoContainer}>
                    <Image source={{ uri: coverUrl }} style={styles.coverImage} />
                    <View style={styles.textColumn}>
                        <Text style={styles.title} numberOfLines={1}>{trackTitle}</Text>
                        <Text style={styles.artist} numberOfLines={1}>{artistName}</Text>
                    </View>
                </View>

                <View style={styles.controlsRow}>
                    <TouchableOpacity onPress={onPrev} style={styles.controlButton}>
                        <Ionicons name="play-skip-back" size={24} color={styles.iconColor.color} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={onPlayPause} style={styles.playButton}>
                        <Ionicons name={isPlaying ? "pause" : "play"} size={26} color={styles.playIconColor.color} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onNext} style={styles.controlButton}>
                        <Ionicons name="play-skip-forward" size={24} color={styles.iconColor.color} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}