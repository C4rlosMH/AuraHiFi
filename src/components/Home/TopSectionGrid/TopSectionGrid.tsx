import React, { useState } from 'react';
import { View, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

import TopMixCard from '../Cards/TopMixCard';
import ResumePlaybackCard from '../Cards/ResumePlaybackCard';
import { styles } from './TopSectionGrid.styles';

// Obtenemos el ancho exacto de la pantalla del dispositivo
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TopSectionGridProps {
    topMixes: any[];
    lastTrack: any;
    isPlaying: boolean;
    onPlayPause: () => void;
    onNext: () => void;
    onPrev: () => void;
    onPlaylistPress: (id: string) => void;
    onResumeCardPress: () => void;
}

export default function TopSectionGrid({
    topMixes,
    lastTrack,
    isPlaying,
    onPlayPause,
    onNext,
    onPrev,
    onPlaylistPress,
    onResumeCardPress,
}: TopSectionGridProps) {
    
    // Estado para saber en qué "página" estamos (0 = Grid, 1 = Reproductor)
    const [activeIndex, setActiveIndex] = useState(0);

    // Función que calcula qué página se está viendo al deslizar
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / SCREEN_WIDTH);
        setActiveIndex(currentIndex);
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                horizontal 
                pagingEnabled // 🚀 CLAVE: Hace que se deslice por páginas completas
                showsHorizontalScrollIndicator={false} 
                onScroll={handleScroll}
                scrollEventThrottle={16} // Para que el cálculo sea fluido
                contentContainerStyle={styles.scrollContent}
            >
                {/* --- PÁGINA 1: El Grid de 3x2 --- */}
                <View style={[styles.pageContainer, { width: SCREEN_WIDTH }]}>
                    {topMixes.length > 0 ? (
                        <View style={styles.gridContainer}>
                            {topMixes.slice(0, 6).map(item => (
                                <TopMixCard 
                                    key={item.id} 
                                    title={item.title} 
                                    subtitle={`${item.trackCount || 0} canciones`} 
                                    imageUrl={item.coverArtUrl} 
                                    onPress={() => onPlaylistPress(item.id)} 
                                />
                            ))}
                        </View>
                    ) : (
                        <View style={styles.gridContainer} /> // Espacio vacío si no hay datos
                    )}
                </View>

                {/* --- PÁGINA 2: La Tarjeta de Reanudación --- */}
                <View style={[styles.pageContainer, { width: SCREEN_WIDTH }]}>
                    <View style={styles.resumeWrapper}>
                        <ResumePlaybackCard 
                            trackTitle={lastTrack?.title || "Nada reproduciéndose"}
                            artistName={lastTrack?.artist || "Toca para mezclar"}
                            coverUrl={lastTrack?.artwork || "https://via.placeholder.com/150"}
                            isPlaying={isPlaying}
                            onPlayPause={onPlayPause}
                            onNext={onNext}
                            onPrev={onPrev}
                            onCardPress={onResumeCardPress} // 🚀 PASAMOS LA ACCIÓN AQUÍ
                        />
                    </View>
                </View>
            </ScrollView>

            {/* --- INDICADORES DE PÁGINA (Puntitos) --- */}
            <View style={styles.paginationContainer}>
                <View style={[styles.dot, activeIndex === 0 && styles.activeDot]} />
                <View style={[styles.dot, activeIndex === 1 && styles.activeDot]} />
            </View>
        </View>
    );
}