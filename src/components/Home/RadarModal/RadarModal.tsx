import React, { useContext, useRef, useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, FlatList, Image, Animated, PanResponder, Dimensions } from 'react-native';

import { SocketContext } from '../../../context/SocketContext';
import { AuthContext } from '../../../context/AuthContext';
import PlayingIndicator from '../../Common/PlayingIndicator/PlayingIndicator';
import { styles } from './RadarModal.styles';
import { colors } from '../../../styles/theme';
import MarqueeText from '../../Common/MarqueeText/MarqueeText';
import { Octicons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Puntos de anclaje (Snap Points) para el modal
const MIN_HEIGHT = SCREEN_HEIGHT * 0.45; // 45% de la pantalla (Compacto)
const MAX_HEIGHT = SCREEN_HEIGHT * 0.85; // 85% de la pantalla (Expandido)

interface RadarModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function RadarModal({ isVisible, onClose }: RadarModalProps) {
    // 👇 Todo esto DEBE estar estrictamente aquí adentro
    const { activeUsers, isConnected, socket } = useContext(SocketContext);
    const { user } = useContext(AuthContext);

    // 🚀 TEMPORAL: Mostramos a todos (incluyéndote a ti) para probar el hardware
    // const otherUsers = activeUsers.filter(u => u.username !== user);
    const otherUsers = activeUsers;

    const [isExpanded, setIsExpanded] = useState(false);
    const animatedHeight = useRef(new Animated.Value(MIN_HEIGHT)).current;

    useEffect(() => {
        if (isVisible) {
            Animated.spring(animatedHeight, {
                toValue: MIN_HEIGHT,
                useNativeDriver: false,
                bounciness: 8,
            }).start();
            setIsExpanded(false);
        }
    }, [isVisible]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                // Solo permitimos arrastrar dentro de los límites
                const newHeight = (isExpanded ? MAX_HEIGHT : MIN_HEIGHT) - gestureState.dy;
                if (newHeight >= MIN_HEIGHT && newHeight <= MAX_HEIGHT) {
                    animatedHeight.setValue(newHeight);
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                // Si el usuario arrastró hacia arriba con fuerza o distancia
                if (gestureState.dy < -50 || gestureState.vy < -0.5) {
                    Animated.spring(animatedHeight, { toValue: MAX_HEIGHT, useNativeDriver: false, bounciness: 5 }).start();
                    setIsExpanded(true);
                } 
                // Si arrastró hacia abajo para compactar
                else if (gestureState.dy > 50 || gestureState.vy > 0.5) {
                    Animated.spring(animatedHeight, { toValue: MIN_HEIGHT, useNativeDriver: false, bounciness: 5 }).start();
                    setIsExpanded(false);
                    
                    // Si ya estaba compacto y arrastra hacia abajo, cerramos el modal
                    if (!isExpanded && gestureState.dy > 80) {
                        onClose();
                    }
                } else {
                    // Si no fue suficiente, rebota a su estado actual
                    Animated.spring(animatedHeight, {
                        toValue: isExpanded ? MAX_HEIGHT : MIN_HEIGHT,
                        useNativeDriver: false,
                        bounciness: 8
                    }).start();
                }
            }
        })
    ).current;

    const handleJoinTune = (hostUsername: string) => {
        console.log(`Uniendo al Tune de ${hostUsername}`);
    };

    const handleSendTap = (targetUsername: string) => {
        if (socket && isConnected) {
            // Enviamos el evento directo a tu manejador de Node.js
            socket.emit('resonar:send_tap', targetUsername);
        }
    };

    return (
        <Modal visible={isVisible} transparent={true} animationType="fade" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <Animated.View style={[styles.bottomSheet, { height: animatedHeight }]}>
                            
                            {/* Área de arrastre conectada al PanResponder */}
                            <View {...panResponder.panHandlers} style={{ width: '100%', backgroundColor: 'transparent' }}>
                                <View style={styles.dragHandleContainer}>
                                    <View style={styles.dragHandle} />
                                </View>
                            </View>

                            <View style={styles.headerContainer}>
                                <View>
                                    <Text style={styles.title}>Actividad</Text>
                                    <Text style={styles.subtitle}>
                                        {isConnected ? 'Sintonía Global' : 'Desconectado del servidor'}
                                    </Text>
                                </View>
                                {/* <MaterialCommunityIcons name="account-group" size={28} color={colors.light} /> */}
                            </View>

                            <FlatList
                                data={otherUsers}
                                keyExtractor={(item) => item.username}
                                contentContainerStyle={styles.listContent}
                                showsVerticalScrollIndicator={false}
                                // Evitamos que el scroll de la lista pelee con el gesto de arrastrar cuando está compacto
                                scrollEnabled={isExpanded || otherUsers.length > 4} 
                                ListEmptyComponent={
                                    <View style={styles.emptyState}>
                                        <Ionicons name="planet-outline" size={48} color={colors.textMuted} />
                                        <Text style={styles.emptyText}>Nadie en tu órbita ahora mismo.</Text>
                                    </View>
                                }
                                renderItem={({ item }) => (
                                    <View style={styles.userRow}>
                                        
                                        {/* AVATAR + ECUALIZADOR (Spotify Style) */}
                                        <View style={styles.avatarContainer}>
                                            {item.presence.albumArt ? (
                                                <Image source={{ uri: item.presence.albumArt }} style={styles.avatarImage} />
                                            ) : (
                                                <Ionicons name="person" size={20} color={colors.textMuted} />
                                            )}
                                            
                                            {/* El ecualizador aparece solo si está escuchando música */}
                                            {item.presence.isPlaying && (
                                                <View style={styles.eqOverlay}>
                                                    <PlayingIndicator isPlaying={true} color={colors.listening} />
                                                </View>
                                            )}
                                        </View>

                                        {/* TEXTOS (Nombre y Metadata comprimida) */}
                                        <View style={styles.userInfo}>
                                            <Text style={styles.displayName} numberOfLines={1}>
                                                {/* 🚀 Usamos el nombre real que viene del servidor */}
                                                {item.presence.displayName} 
                                            </Text>
                                            
                                            {item.presence.isPlaying ? (
                                                <MarqueeText 
                                                    text={`${item.presence.songTitle} • ${item.presence.artistName}`}
                                                    style={styles.trackMeta}
                                                />
                                            ) : (
                                                <Text style={styles.trackMeta}>Inactivo</Text>
                                            )}
                                        </View>

                                        {/* BOTONES DE ACCIÓN MÍNIMOS */}
                                        <View style={styles.actionsContainer}>
                                            {/* 🚀 Botón Resonar (Waveform) */}
                                            <TouchableOpacity style={styles.actionBtn} onPress={() => handleSendTap(item.username)}>
                                                <MaterialCommunityIcons name="waveform" size={20} color={colors.light} />
                                            </TouchableOpacity>

                                            {/* 🚀 Botón Unirse al Tune (People) */}
                                            {item.presence.isPlaying && (
                                                <TouchableOpacity 
                                                    style={[styles.actionBtn, styles.actionBtnPrimary]} 
                                                    onPress={() => handleJoinTune(item.username)}
                                                >
                                                    <Octicons name="people" size={18} color={colors.background} />
                                                </TouchableOpacity>
                                            )}
                                        </View>

                                    </View>
                                )}
                            />
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}