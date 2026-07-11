import React, { ReactNode } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles } from './HorizontalSection.styles';

interface HorizontalSectionProps {
    title: string;
    children: ReactNode;
}

export default function HorizontalSection({ title, children }: HorizontalSectionProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.scrollContent}
            >
                {children}
            </ScrollView>
        </View>
    );
}