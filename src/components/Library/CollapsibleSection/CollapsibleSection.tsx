import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, UIManager, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './CollapsibleSection.styles';
import { colors } from '../../../styles/theme';

// Habilitar animaciones fluidas en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
}

export default function CollapsibleSection({ title, children }: CollapsibleSectionProps) {
    const [isOpen, setIsOpen] = useState(true);

    const toggleOpen = () => {
        // Le da un efecto de deslizamiento muy suave al abrir/cerrar
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsOpen(!isOpen);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.header} 
                onPress={toggleOpen}
                activeOpacity={0.7}
            >
                <Text style={styles.title}>{title}</Text>
                <Ionicons 
                    name={isOpen ? "chevron-up" : "chevron-down"} 
                    size={24} 
                    color={colors.textMuted} 
                />
            </TouchableOpacity>

            {/* Solo renderiza el contenido si está abierto */}
            {isOpen && (
                <View style={styles.content}>
                    {children}
                </View>
            )}
        </View>
    );
}