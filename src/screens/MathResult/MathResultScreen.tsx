import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AuraBackground from '../../components/AuraBackground/AuraBackground';
import CollectionHeader from '../../components/CollectionDetail/Header/CollectionHeader'; // 🚀 Usamos tu header
import CollectionTrackList from '../../components/CollectionDetail/TrackList/CollectionTrackList';
import CreatePlaylistModal from '../../components/Library/CreatePlaylistModal/CreatePlaylistModal';

import { Track } from '../../services/navidromeApi';
import { playerService } from '../../services/PlayerService';

import { styles } from './MathResultScreen.styles';
import { colors } from '../../styles/theme';

export default function MathResultScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();

    const { tracks, operationName } = route.params as { tracks: Track[], operationName: string };
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

    const handlePlayAll = () => {
        if (tracks.length > 0) {
            playerService.playCollection(tracks[0], tracks);
        }
    };

    return (
        <AuraBackground coverUrl={tracks.length > 0 ? tracks[0].coverArtUrl : undefined}>
            <View style={styles.container}>
                
                {/* 🚀 Mismo UX que los detalles de álbumes/playlists */}
                <CollectionHeader 
                    onBack={() => navigation.goBack()} 
                    onOptions={() => {}} // Vacío por ahora
                />

                <ScrollView showsVerticalScrollIndicator={false}>
                    
                    <View style={styles.summaryCard}>
                        <Text style={styles.title}>{operationName}</Text>
                        <Text style={styles.subtitle}>
                            {tracks.length > 0 ? `Se encontraron ${tracks.length} canciones` : 'No se encontraron coincidencias'}
                        </Text>

                        {tracks.length > 0 && (
                            <View style={styles.actionRow}>
                                <TouchableOpacity style={[styles.actionButton, styles.playButton]} onPress={handlePlayAll}>
                                    <Ionicons name="play" size={20} color="#000" />
                                    <Text style={[styles.buttonText, styles.playButtonText]}>Escuchar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.actionButton} onPress={() => setIsCreateModalVisible(true)}>
                                    <Ionicons name="save-outline" size={20} color={colors.primary} />
                                    <Text style={styles.buttonText}>Guardar</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {tracks.length > 0 && (
                        <CollectionTrackList 
                            tracks={tracks} 
                            onPlayTrack={(track) => playerService.playCollection(track, tracks)} 
                            showCovers={true}
                        />
                    )}

                </ScrollView>
            </View>

            <CreatePlaylistModal 
                isVisible={isCreateModalVisible}
                onClose={() => setIsCreateModalVisible(false)}
                initialTrackIds={tracks.map(t => t.id)} // 🚀 AQUÍ ESTÁ LA MAGIA, le pasamos los IDs extraídos
                onSuccess={() => {
                    Alert.alert("Aura Hi-Fi", "Playlist creada y música añadida con éxito.");
                    // Redirigimos a la biblioteca para que vea su nueva lista
                    navigation.navigate('Library'); 
                }}
            />
        </AuraBackground>
    );
}