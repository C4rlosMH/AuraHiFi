import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './HomeHeader.styles';

const AURA_LOGO_IMAGE = require('../../../assets/aura-lossless.png');

interface HomeHeaderProps {
    profilePicUrl: string;
    onNotificationsPress: () => void;
    onProfilePress: () => void;
}

export default function HomeHeader({ profilePicUrl, onNotificationsPress, onProfilePress }: HomeHeaderProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.profileContainer} 
                onPress={onProfilePress} 
                activeOpacity={0.8}
            >
                <Image source={{ uri: profilePicUrl }} style={styles.profilePic} />
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
                <Image source={AURA_LOGO_IMAGE} style={styles.logoImage} resizeMode="contain" />
            </View>
            
            <TouchableOpacity style={styles.iconButton} onPress={onNotificationsPress}>
                <Ionicons name="notifications-outline" size={20} color={styles.iconColor.color} />
            </TouchableOpacity>
        </View>
    );
}