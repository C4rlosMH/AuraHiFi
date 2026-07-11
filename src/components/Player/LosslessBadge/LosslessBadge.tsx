import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from './LosslessBadge.styles';

export default function LosslessBadge() {
    return (
        <View style={styles.badge}>
            <Image 
                source={require('../../../assets/aura-lossless.png')} 
                style={styles.logo} 
            />
            <Text style={styles.text}>lossless</Text>
        </View>
    );
}