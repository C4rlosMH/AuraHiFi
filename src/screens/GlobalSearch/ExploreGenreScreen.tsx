import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/theme';
import { styles } from './ExploreGenreScreen.styles';

import AuraBackground from '../../components/AuraBackground/AuraBackground';
import { navidromeApi } from '../../services/navidromeApi';
import { playerService } from '../../services/PlayerService';

export default function ExploreGenreScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { genre } = route.params;

    const [isLoading, setIsLoading] = useState(true);
    const [mixSongs, setMixSongs] = useState<any[]>([]);
    const [newAlbums, setNewAlbums] = useState<any[]>([]);
    const [exploreAlbums, setExploreAlbums] = useState<any[]>([]);

    useEffect(() => {
        const loadGenreData = async () => {
            try {
                let songs: any[] = [];
                let newest: any[] = [];
                let explore: any[] = [];

                switch (genre) {
                    case 'Favoritos':
                        // Usamos tu funcion existente de canciones favoritas
                        songs = await navidromeApi.getStarredTracks();
                        newest = await navidromeApi.getRecentAlbums(10);
                        explore = await navidromeApi.getFrequentAlbums(10);
                        break;
                        
                    case 'Novedades':
                        songs = await navidromeApi.getRandomSongs(30);
                        newest = await navidromeApi.getRecentAlbums(15);
                        explore = await navidromeApi.getRandomAlbums(10);
                        break;
                        
                    case 'Creado para ti':
                        songs = await navidromeApi.getRandomSongs(30);
                        newest = await navidromeApi.getFrequentAlbums(10);
                        explore = await navidromeApi.getRandomAlbums(10);
                        break;
                        
                    case 'Audio Hi-Res':
                    case 'Descargas locales':
                        // Por ahora usamos canciones aleatorias para poblar la vista,
                        // mas adelante conectaremos esto a tu base de datos SQLite offline
                        songs = await navidromeApi.getRandomSongs(30);
                        newest = await navidromeApi.getRecentAlbums(10);
                        explore = await navidromeApi.getRandomAlbums(10);
                        break;
                        
                    default:
                        // ES UN GENERO MUSICAL REAL (Pop, Electronica, Dance)
                        // Muchos metadatos no usan tildes, asi que la limpiamos por si acaso
                        const normalizedGenre = genre.replace('ó', 'o').replace('í', 'i');
                        
                        [songs, newest, explore] = await Promise.all([
                            navidromeApi.getGenreMix(normalizedGenre, 30),
                            navidromeApi.getGenreAlbums(normalizedGenre, 'newest', 10),
                            navidromeApi.getGenreAlbums(normalizedGenre, 'random', 10)
                        ]);
                        break;
                }

                // Para las categorias especiales, desordenamos el arreglo para que el "Mix" 
                // siempre se sienta diferente cada vez que entras a la pantalla
                if (['Favoritos', 'Novedades', 'Creado para ti', 'Audio Hi-Res', 'Descargas locales'].includes(genre)) {
                    songs = songs.sort(() => Math.random() - 0.5).slice(0, 30);
                }

                setMixSongs(songs);
                setNewAlbums(newest);
                setExploreAlbums(explore);
            } catch (error) {
                console.error("Error cargando datos de la categoria:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadGenreData();
    }, [genre]);

    const playMix = () => {
        if (mixSongs.length === 0) return;
        playerService.playCollection(mixSongs[0], mixSongs);
    };

    const navigateToAlbum = (album: any) => {
        navigation.navigate('CollectionDetail', { 
            id: album.id, 
            type: 'album', 
            title: album.title,
            imageUrl: album.coverArtUrl
        });
    };

    // Extraemos hasta 4 portadas unicas para el collage de fondo
    const uniqueCovers = Array.from(new Set(mixSongs.map(song => song.coverArtUrl))).slice(0, 4);

    if (isLoading) {
        return (
            <AuraBackground>
                <View style={[styles.container, styles.center]}>
                    <ActivityIndicator size="large" color={colors.accent} />
                </View>
            </AuraBackground>
        );
    }

    return (
        <AuraBackground>
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={28} color={colors.primary} />
                    </TouchableOpacity>
                    <Text style={styles.title}>{genre}</Text>
                </View>

                {mixSongs.length > 0 && (
                    <View style={styles.section}>
                        <TouchableOpacity style={styles.mixCard} onPress={playMix}>
                            
                            {/* Collage de imagenes en el fondo */}
                            <View style={styles.collageContainer}>
                                {uniqueCovers.map((cover, index) => (
                                    <Image key={index} source={{ uri: cover }} style={styles.collageImage} />
                                ))}
                            </View>
                            
                            {/* Capa oscura para que el texto sea legible */}
                            <View style={styles.darkOverlay} />

                            <View style={styles.mixOverlay}>
                                <Text style={styles.mixTitle}>{genre} Mix</Text>
                                <Text style={styles.mixSubtitle}>Estacion aleatoria de tu biblioteca</Text>
                            </View>
                            <View style={styles.playIconContainer}>
                                <Ionicons name="play" size={32} color={colors.background} />
                            </View>
                        </TouchableOpacity>
                    </View>
                )}

                {newAlbums.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Nuevos lanzamientos</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
                            {newAlbums.map((album) => (
                                <TouchableOpacity 
                                    key={`new-${album.id}`} 
                                    style={styles.albumCard}
                                    onPress={() => navigateToAlbum(album)}
                                >
                                    <Image source={{ uri: album.coverArtUrl }} style={styles.albumArt} />
                                    <Text style={styles.albumTitle} numberOfLines={1}>{album.title}</Text>
                                    <Text style={styles.albumArtist} numberOfLines={1}>{album.artist}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {exploreAlbums.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Descubre mas en {genre}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
                            {exploreAlbums.map((album) => (
                                <TouchableOpacity 
                                    key={`rand-${album.id}`} 
                                    style={styles.albumCard}
                                    onPress={() => navigateToAlbum(album)}
                                >
                                    <Image source={{ uri: album.coverArtUrl }} style={styles.albumArt} />
                                    <Text style={styles.albumTitle} numberOfLines={1}>{album.title}</Text>
                                    <Text style={styles.albumArtist} numberOfLines={1}>{album.artist}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

            </ScrollView>
        </AuraBackground>
    );
}