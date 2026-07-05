import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation } from 'react-native';
import { styles } from './ArtistMetadata.styles';

interface ArtistMetadataProps {
    name: string;
    albumCount?: number;
    biography?: string;
    actions?: React.ReactNode; // 🚀 PATRÓN DE COMPOSICIÓN: Recibimos los botones sin mezclar código
}

export default function ArtistMetadata({ name, albumCount, biography, actions }: ArtistMetadataProps) {
    const [isBioExpanded, setIsBioExpanded] = useState(false);

    const toggleBio = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsBioExpanded(!isBioExpanded);
    };

    return (
        <View style={styles.container}>
            {/* FILA PRINCIPAL: Textos Izquierda, Acciones Derecha */}
            <View style={styles.topRow}>
                <View style={styles.textInfo}>
                    <Text style={styles.name} numberOfLines={2}>{name}</Text>
                    <Text style={styles.stats}>{albumCount} Álbumes</Text>
                </View>

                {/* El hueco donde el padre inyecta los botones */}
                {actions && <View>{actions}</View>}
            </View>

            {/* SECCIÓN BIOGRAFÍA (Debajo) */}
            {biography && biography.length > 10 && (
                <TouchableOpacity style={styles.bioContainer} onPress={toggleBio} activeOpacity={0.7}>
                    <Text style={styles.bioText} numberOfLines={isBioExpanded ? undefined : 3}>
                        {biography}
                    </Text>
                    <Text style={styles.bioReadMore}>
                        {isBioExpanded ? 'Ocultar biografía' : 'Leer más'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}