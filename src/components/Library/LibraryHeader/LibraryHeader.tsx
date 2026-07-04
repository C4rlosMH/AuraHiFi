import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './LibraryHeader.styles';

export default function LibraryHeader() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Biblioteca</Text>
        </View>
    );
}