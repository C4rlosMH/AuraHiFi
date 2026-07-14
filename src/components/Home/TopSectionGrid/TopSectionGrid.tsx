import React, { useState } from 'react';
import { View, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

import TopMixCard from '../Cards/TopMixCard';
import ResumePlaybackCard from '../Cards/ResumePlaybackCard';
import { styles } from './TopSectionGrid.styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TopSectionGridProps {
    topMixes: any[];
    lastTrack: any;
    isPlaying: boolean;
    onPlayPause: () => void;
    onNext: () => void;
    onPrev: () => void;
    onItemPress: (id: string, type: 'playlist' | 'album') => void; // 🚀 Ahora es dinámico
    onResumeCardPress: () => void;
}

export default function TopSectionGrid({
    topMixes,
    lastTrack,
    isPlaying,
    onPlayPause,
    onNext,
    onPrev,
    onItemPress,
    onResumeCardPress,
}: TopSectionGridProps) {
    
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / SCREEN_WIDTH);
        setActiveIndex(currentIndex);
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                horizontal 
                pagingEnabled 
                showsHorizontalScrollIndicator={false} 
                onScroll={handleScroll}
                scrollEventThrottle={16} 
                contentContainerStyle={styles.scrollContent}
            >
                {/* --- PÁGINA 1: El Grid de 3x2 Inteligente --- */}
                <View style={[styles.pageContainer, { width: SCREEN_WIDTH }]}>
                    {topMixes.length > 0 ? (
                        <View style={styles.gridContainer}>
                            {topMixes.slice(0, 6).map(item => (
                                <TopMixCard 
                                    key={`top-${item.type}-${item.id}`} 
                                    title={item.title || item.name} 
                                    // 🚀 Subtítulo dinámico: Si es playlist dice las canciones, si es álbum dice el artista
                                    subtitle={item.type === 'album' ? item.artist : `${item.trackCount || 0} temas`} 
                                    // 🚀 CORRECCIÓN DEL BUG: Atrapamos la imagen venga como venga
                                    imageUrl={item.coverArtUrl || item.imageUrl} 
                                    onPress={() => onItemPress(item.id, item.type)} 
                                />
                            ))}
                        </View>
                    ) : (
                        <View style={styles.gridContainer} /> 
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
                            onCardPress={onResumeCardPress}
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