import React, { useEffect, useState } from 'react';
import { Text, ScrollView, View, ActivityIndicator } from 'react-native';
import { useActiveTrack, useProgress } from 'react-native-track-player';
import { navidromeApi } from '../../../services/navidromeApi';
import { parseLrc, ParsedLyric } from '../../../utils/lrcParser';
import { styles } from './TrackLyrics.styles';

export default function TrackLyrics() {
  const track = useActiveTrack();
  const { position } = useProgress(); 
  
  const [lyrics, setLyrics] = useState<ParsedLyric[]>([]);
  const [staticLyrics, setStaticLyrics] = useState<string | null>(null); // 🔥 NUEVO ESTADO
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLyrics = async () => {
      if (!track?.artist || !track?.title) return;
      
      setIsLoading(true);
      setLyrics([]); 
      setStaticLyrics(null);
      
      try {
        // 1. PRIMERA CAPA: Intentar obtener letras sincronizadas perfectas de LRCLIB
        const syncedLyrics = await navidromeApi.getSyncedLyricsFromLRCLIB(track.artist, track.title);
        
        if (syncedLyrics) {
          const parsed = parseLrc(syncedLyrics);
          if (parsed.length > 0) {
            setLyrics(parsed);
            setIsLoading(false);
            return; // ¡Éxito total! Terminamos aquí.
          }
        }

        // 2. SEGUNDA CAPA: Si LRCLIB no tuvo nada, preguntamos a Navidrome
        console.log("LRCLIB no encontró tiempos, consultando Navidrome...");
        const rawLyrics = await navidromeApi.getLyrics(track.artist, track.title);
        
        if (rawLyrics) {
          const parsed = parseLrc(rawLyrics);
          if (parsed.length > 0) {
            setLyrics(parsed);
          } else {
            // Si Navidrome tampoco tiene tiempos, guardamos la letra plana
            setStaticLyrics(rawLyrics);
          }
        }
      } catch (error) {
        console.log("Error al cargar letras", error);
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

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (lyrics.length === 0 && !staticLyrics) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.inactiveText}>No hay letras disponibles</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* RENDERIZADO CONDICIONAL: Sincronizadas vs Planas */}
      {lyrics.length > 0 ? (
        lyrics.map((line, index) => {
          const isActive = index === activeIndex;
          return (
            <Text 
              key={line.id} 
              style={[
                styles.lyricText, 
                isActive ? styles.activeText : styles.inactiveText
              ]}
            >
              {line.text}
            </Text>
          );
        })
      ) : (
        // 🔥 VISTA DE LETRAS ESTÁTICAS
        <Text style={[styles.lyricText, styles.activeText, { textAlign: 'center' }]}>
          {staticLyrics}
        </Text>
      )}
    </ScrollView>
  );
}