import React, { useEffect, useState, useRef } from 'react';
import { Text, ScrollView, View, ActivityIndicator } from 'react-native';
import { useActiveTrack, useProgress } from 'react-native-track-player';
import { navidromeApi } from '../../../services/navidromeApi';
import { parseLrc, ParsedLyric } from '../../../utils/lrcParser';
import { styles } from './TrackLyrics.styles';

export default function TrackLyrics() {
  const track = useActiveTrack();
  const { position } = useProgress(); 
  
  // 🖐️ Nuestra "mano invisible" para hacer el scroll
  const scrollViewRef = useRef<ScrollView>(null);
  
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
        // 1. PRIMERA CAPA: LRCLIB (Letras sincronizadas)
        const syncedLyrics = await navidromeApi.getSyncedLyricsFromLRCLIB(track.artist, track.title);
        
        if (syncedLyrics) {
          const parsed = parseLrc(syncedLyrics);
          if (parsed.length > 0) {
            setLyrics(parsed);
            setIsLoading(false);
            return;
          }
        }

        // 2. SEGUNDA CAPA: Navidrome (Plan de respaldo)
        console.log("LRCLIB no encontró tiempos, consultando Navidrome...");
        const rawLyrics = await navidromeApi.getLyrics(track.artist, track.title);
        
        if (rawLyrics) {
          const parsed = parseLrc(rawLyrics);
          if (parsed.length > 0) {
            setLyrics(parsed);
          } else {
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

  // 🎬 MOTOR DE CINEMÁTICA (AUTO-SCROLL)
  useEffect(() => {
    if (activeIndex !== -1 && scrollViewRef.current) {
      const LINE_HEIGHT = 45; 
      
      // CAMBIO MATEMÁTICO:
      // En lugar de restar 150 estáticos, calculamos el punto dulce.
      // Al tener un colchón arriba, la coordenada Y inicial cambia para que la 
      // línea activa siempre quede perfectamente centrada a la vista.
      const offsetY = activeIndex * LINE_HEIGHT; 
      
      scrollViewRef.current.scrollTo({
        y: offsetY, 
        animated: true, 
      });
    }
  }, [activeIndex]);

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
      ref={scrollViewRef} 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      // Cambiamos a contentContainerStyle para inyectar los espacios vacíos
      contentContainerStyle={styles.scrollContent}
    >
      {/* 🌤️ ESPACIADOR SUPERIOR: Empuja la primera línea al centro/mitad de la pantalla */}
      <View style={{ height: 220 }} /> 

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
        <Text style={[styles.lyricText, styles.activeText, { textAlign: 'center' }]}>
          {staticLyrics}
        </Text>
      )}

      {/* 🕳️ ESPACIADOR INFERIOR: Le da carril al scroll para subir las últimas líneas */}
      <View style={{ height: 350 }} />
    </ScrollView>
  );
}