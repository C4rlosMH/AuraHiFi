import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './HomeHeader.styles';

const AURA_LOGO_IMAGE = require('../../../assets/aura-lossless.png');

interface HomeHeaderProps {
    profilePicUrl: string;
    onNotificationsPress: () => void;
}

export default function HomeHeader({ profilePicUrl, onNotificationsPress }: HomeHeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <Image source={{ uri: profilePicUrl }} style={styles.profilePic} />
            </View>
            <View style={styles.logoContainer}>
                <Image source={AURA_LOGO_IMAGE} style={styles.logoImage} resizeMode="contain" />
            </View>
            
            <TouchableOpacity style={styles.iconButton} onPress={onNotificationsPress}>
                <Ionicons name="notifications-outline" size={20} color={styles.iconColor.color} />
            </TouchableOpacity>
        </View>
    );
}