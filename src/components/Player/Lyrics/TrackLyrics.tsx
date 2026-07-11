import React, { useEffect, useState, useRef } from 'react';
import { Text, View, ActivityIndicator, FlatList } from 'react-native'; 
import { useActiveTrack, useProgress } from 'react-native-track-player';


import { lyricsService } from '../../../services/lyricsService';
import { ParsedLyric } from '../../../utils/lrcParser';
import { styles } from './TrackLyrics.styles';
import { colors } from '../../../styles/theme';

export default function TrackLyrics() {
  const track = useActiveTrack();
  const { position } = useProgress(); 
  
  const flatListRef = useRef<FlatList>(null);
  
  const [lyrics, setLyrics] = useState<ParsedLyric[]>([]);
  const [staticLyrics, setStaticLyrics] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLyrics = async () => {
      if (!track?.artist || !track?.title) return;
      
      setIsLoading(true);
      setLyrics([]); 
      setStaticLyrics(null);
      
      try {
        // 🥇 PRIORIDAD 1: Buscar archivo .lrc en tu NAS
        console.log(`Buscando .lrc en NAS para el ID: ${track.id}`);
        const nasLyrics = await lyricsService.getLyricsFromNAS(track.id);
        
        if (nasLyrics.synced.length > 0) {
            console.log("¡Éxito! Letras sincronizadas obtenidas del NAS.");
            setLyrics(nasLyrics.synced);
            setIsLoading(false);
            return;
        }

        // 🥈 PRIORIDAD 2: Si el NAS no tiene el archivo, buscamos en internet (LRCLIB)
        console.log("No hay .lrc local, buscando en LRCLIB...");
        const lrcLibLyrics = await lyricsService.getLyricsFromLRCLIB(track.artist, track.title);
        
        if (lrcLibLyrics.length > 0) {
            console.log("Letras obtenidas de LRCLIB.");
            setLyrics(lrcLibLyrics);
            setIsLoading(false);
            return;
        }

        // 🥉 PRIORIDAD 3: Textos estáticos (sin sincronizar)
        console.log("No hay letras sincronizadas, buscando estáticas...");
        if (nasLyrics.staticText) {
            setStaticLyrics(nasLyrics.staticText);
        } else {
            const oldStatic = await lyricsService.getOldStaticLyrics(track.artist, track.title);
            setStaticLyrics(oldStatic);
        }

      } catch (error) {
        console.log("Error en el flujo de carga de letras", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLyrics();
  }, [track?.id]);

  const getActiveIndex = () => {
    let activeIdx = -1;
    for (let i = 0; i < lyrics.length; i++) {
        if (position >= lyrics[i].time) {
            activeIdx = i; 
        } else {
            break; 
        }
    }
    return activeIdx;
  };

  const activeIndex = getActiveIndex();

  useEffect(() => {
    if (activeIndex !== -1 && flatListRef.current && lyrics.length > 0) {
      try {
        flatListRef.current.scrollToIndex({
          index: activeIndex, 
          animated: true, 
          viewPosition: 0.5,
        });
      } catch (e) {
        // FlatList tira error inofensivo si intentas scrollear a un item no renderizado
      }
    }
  }, [activeIndex, lyrics.length]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.light} />
      </View>
    );
  }

  if (lyrics.length === 0 && !staticLyrics) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.inactiveText}>No hay letras disponibles</Text>
      </View>
    );
  }

  return (
    <FlatList
      ref={flatListRef}
      data={lyrics}
      keyExtractor={(item) => item.id}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent} // 🚀 TOTALMENTE LIMPIO
      fadingEdgeLength={50}
      onScrollToIndexFailed={(info) => {
        const wait = new Promise(resolve => setTimeout(resolve, 500));
        wait.then(() => {
          flatListRef.current?.scrollToIndex({ index: info.index, animated: true, viewPosition: 0.5 });
        });
      }}
      renderItem={({ item, index }) => {
        const isActive = index === activeIndex;
        return (
          <Text 
            style={[
              styles.lyricText, 
              isActive ? styles.activeText : styles.inactiveText
            ]}
          >
            {item.text}
          </Text>
        );
      }}
      ListEmptyComponent={
        staticLyrics ? (
          <Text style={[styles.lyricText, styles.activeText]}>{staticLyrics}</Text>
        ) : null
      }
    />
  );
}