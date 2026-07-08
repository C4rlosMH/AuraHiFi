import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, ScrollView } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { useRoute, useNavigation } from '@react-navigation/native';

import { navidromeApi, Track } from '../../services/navidromeApi';
import { colors } from '../../styles/theme';
import { styles } from './ArtistDetailScreen.styles';

import AuraBackground from '../../components/AuraBackground/AuraBackground';
import CollectionHeader from '../../components/CollectionDetail/Header/CollectionHeader'; 
import CollectionGrid from '../../components/Library/CollectionGrid/CollectionGrid'; 
import ArtistCover from '../../components/ArtistDetail/ArtistCover/ArtistCover';
import ArtistMetadata from '../../components/ArtistDetail/ArtistMetadata/ArtistMetadata';
import ArtistActions from '../../components/ArtistDetail/ArtistActions/ArtistActions';
import ArtistTopTracks from '../../components/ArtistDetail/ArtistTopTracks/ArtistTopTracks';



export default function ArtistDetailScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { id, name } = route.params; 

    const [artistData, setArtistData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const data = await navidromeApi.getArtistDetails(id, name);
                setArtistData(data);
            } catch (error) {
                console.log("Error cargando artista", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArtist();
    }, [id, name]);



    const handleOpenAlbum = (albumId: string, albumTitle: string) => {
        navigation.push('CollectionDetail', { id: albumId, type: 'album', title: albumTitle });
    };

    // Función base que mapea e inyecta la cola al motor de Android/iOS
    const playQueue = async (tracksToPlay: Track[], startIndex: number = 0) => {
        try {
            // Traducimos nuestro Track al objeto nativo que exige TrackPlayer
            const trackPlayerQueue = tracksToPlay.map(t => ({
                id: t.id,
                url: t.streamUrl,         // <-- Lo que TrackPlayer necesita para sonar
                title: t.title,
                artist: t.artist,
                artwork: t.coverArtUrl    // <-- Lo que TrackPlayer necesita para la pantalla de bloqueo
            }));

            await TrackPlayer.reset();
            await TrackPlayer.add(trackPlayerQueue);
            await TrackPlayer.skip(startIndex);
            await TrackPlayer.play();
        } catch (error) {
            console.error("Error al inyectar al TrackPlayer:", error);
        }
    };

    // 1. Tocar una canción específica de la lista
    const handlePlayTrack = (track: Track, index: number) => {
        playQueue(artistData.topTracks, index);
    };

    // 2. Botón "Play" principal
    const handlePlayAll = () => {
        if (!artistData?.topTracks?.length) return;
        playQueue(artistData.topTracks, 0);
    };

    // 3. Botón "Shuffle" principal
    const handleShuffle = () => {
        if (!artistData?.topTracks?.length) return;
        // Creamos una copia desordenada usando sort y Math.random
        const shuffledTracks = [...artistData.topTracks].sort(() => Math.random() - 0.5);
        playQueue(shuffledTracks, 0);
    };


    if (isLoading) {
        return (
            <AuraBackground forceType="eclipseMarcial">
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.accent} />
                </View>
            </AuraBackground>
        );
    }

    if (isLoading || !artistData) {
        return (
            <AuraBackground>
                <View style={styles.container}>
                    {/* Mantenemos el header para que el usuario pueda regresar si la red está lenta */}
                    <CollectionHeader onBack={() => navigation.goBack()} />
                    
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={colors.accent} />
                    </View>
                </View>
            </AuraBackground>
        );
    }

    return (
        <AuraBackground coverUrl={artistData?.artistImageUrl}>
            <View style={styles.container}>
                <CollectionHeader onBack={() => navigation.goBack()} />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    
                    {/* 🚀 COMPONENTE 1: La foto pura centrada */}
                    <ArtistCover imageUrl={artistData?.artistImageUrl} />

                    {/* 🚀 COMPONENTE 2: Los metadatos puros */}
                    <ArtistMetadata 
                        name={artistData.name} 
                        albumCount={artistData.albumCount} 
                        biography={artistData.biography} 
                        actions={
                            <ArtistActions 
                                onPlayAll={handlePlayAll} 
                                onShuffle={handleShuffle}
                            />
                        }
                    />

                    <ArtistTopTracks 
                        tracks={artistData.topTracks} 
                        onPlayTrack={handlePlayTrack} 
                    />

                    <View style={styles.gridWrapper}>
                        <CollectionGrid 
                            title="Discografía"
                            data={artistData.albums}
                            onItemPress={handleOpenAlbum}
                        />
                    </View>

                </ScrollView>
            </View>
        </AuraBackground>
    );
}