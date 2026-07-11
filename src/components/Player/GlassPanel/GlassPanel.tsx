import React from 'react';
import { View } from 'react-native';
import { styles } from './GlassPanel.styles';

interface GlassPanelProps {
    artwork?: string;
    children: React.ReactNode;
}

export default function GlassPanel({ children }: GlassPanelProps) {
    return (
        <View style={styles.panelContainer}>
            <View style={styles.contentContainer}>
                {children}
            </View>
        </View>
    );
}