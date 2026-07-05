import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, ScrollView } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { useRoute, useNavigation } from '@react-navigation/native';

import { navidromeApi } from '../../services/navidromeApi';
import { colors } from '../../styles/theme';
import { styles } from './ArtistDetailScreen.styles';

import AuraBackground from '../../components/AuraBackground/AuraBackground';
import CollectionHeader from '../../components/CollectionDetail/Header/CollectionHeader'; 
import CollectionGrid from '../../components/Library/CollectionGrid/CollectionGrid'; 

// 🚀 IMPORTAMOS NUESTROS COMPONENTES SEPARADOS
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

    const handlePlayTrack = async (selectedTrack: any, index: number) => {
        try {
            // 1. Limpiamos la cola actual del reproductor
            await TrackPlayer.reset();
            // 2. Cargamos todo el Top 5 a la memoria del reproductor
            await TrackPlayer.add(artistData.topTracks);
            // 3. Saltamos exactamente al índice de la canción que tocó el usuario
            await TrackPlayer.skip(index);
            // 4. ¡Play!
            await TrackPlayer.play();
            // 5. Opcional: Podrías navegar al reproductor aquí si quieres, o dejar que suene en el mini-player.
            // navigation.navigate('Player'); 
        } catch (error) {
            console.error("Error al reproducir el top track:", error);
        }
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
                                onPlayAll={() => handlePlayTrack(artistData.topTracks[0], 0)} 
                                onShuffle={() => console.log("Shuffle artista")} 
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