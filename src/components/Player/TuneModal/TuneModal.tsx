import React, { useContext } from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, FlatList, Image, Switch } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';

import { SocketContext } from '../../../context/SocketContext';
import { AuthContext } from '../../../context/AuthContext';
import PlayingIndicator from '../../Common/PlayingIndicator/PlayingIndicator';
import MarqueeText from '../../Common/MarqueeText/MarqueeText';

import { styles } from './TuneModal.styles';
import { colors } from '../../../styles/theme';

interface TuneModalProps {
    isVisible: boolean;
    onClose: () => void;
    isHostingTune?: boolean; 
    onStartTune: () => void;
    onLeaveTune: () => void;
}

export default function TuneModal({ isVisible, onClose, isHostingTune = false, onStartTune, onLeaveTune }: TuneModalProps) {
    const { activeUsers, isConnected, socket } = useContext(SocketContext);
    const { user } = useContext(AuthContext);

    // Filtramos para no mostrarte a ti mismo en el escáner
    const otherUsers = activeUsers.filter(u => u.username !== user);

    const handleRequestJoin = (targetUsername: string) => {
        if (socket && isConnected) {
            console.log(`Enviando petición de unión a ${targetUsername}`);
            socket.emit('tune:request_join', { targetUsername });
        }
    };

    const handleSendTap = (targetUsername: string) => {
        if (socket && isConnected) {
            socket.emit('resonar:send_tap', targetUsername);
        }
    };

    return (
        <Modal visible={isVisible} transparent={true} animationType="slide" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.bottomSheet}>
                            
                            <View style={styles.dragHandleContainer}>
                                <View style={styles.dragHandle} />
                            </View>

                            <View style={styles.headerContainer}>
                                <Text style={styles.title}>Tune</Text>
                                {/* <Text style={styles.subtitle}>Escucha música en sincronía con tu red</Text> */}
                            </View>

                            {/* --- SECCIÓN: TU JAM / TUNE --- */}
                            <View style={styles.hostCard}>
                                <View style={styles.hostTextContainer}>
                                    <Text style={styles.hostTitle}>
                                        {isHostingTune ? 'Estás transmitiendo' : 'Empieza un Tune'}
                                    </Text>
                                    <Text style={styles.hostSubtitle} numberOfLines={2}>
                                        {isHostingTune 
                                            ? 'Tus amigos pueden unirse a tu sesión en tiempo real.' 
                                            : 'Conviértete en el anfitrión y permite que otros escuchen lo que tú.'}
                                    </Text>
                                </View>
                                
                                {/* 🚀 NUEVO: Interruptor elegante en lugar de un botón */}
                                <Switch 
                                    value={isHostingTune} 
                                    onValueChange={(value) => {
                                        if (value) {
                                            onStartTune();
                                        } else {
                                            onLeaveTune();
                                        }
                                    }} 
                                    trackColor={{ false: colors.glassDark, true: colors.light }}
                                    thumbColor={colors.primary}
                                />
                            </View>

                            {/* --- SECCIÓN: ESCÁNER DE RED (Gente cerca) --- */}
                            <Text style={styles.sectionTitle}>Unirse</Text>
                            
                            <FlatList
                                data={otherUsers}
                                keyExtractor={(item) => item.username}
                                contentContainerStyle={styles.listContent}
                                showsVerticalScrollIndicator={false}
                                ListEmptyComponent={
                                    <View style={styles.emptyState}>
                                        <Ionicons name="radar-outline" size={48} color={colors.glassDark} />
                                        <Text style={styles.emptyText}>No detectamos a nadie más activo en el servidor ahora mismo.</Text>
                                    </View>
                                }
                                renderItem={({ item }) => (
                                    <View style={styles.userRow}>
                                        
                                        <View style={styles.avatarContainer}>
                                            {item.presence.albumArt ? (
                                                <Image source={{ uri: item.presence.albumArt }} style={styles.avatarImage} />
                                            ) : (
                                                <Ionicons name="person" size={20} color={colors.textMuted} />
                                            )}
                                            {item.presence.isPlaying && (
                                                <View style={styles.eqOverlay}>
                                                    <PlayingIndicator isPlaying={true} color={colors.listening} />
                                                </View>
                                            )}
                                        </View>

                                        <View style={styles.userInfo}>
                                            <Text style={styles.displayName} numberOfLines={1}>
                                                {item.presence.displayName || item.username.charAt(0).toUpperCase() + item.username.slice(1)} 
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

                                        <View style={styles.actionsContainer}>
                                            {/* Resonar */}
                                            <TouchableOpacity style={styles.actionBtn} onPress={() => handleSendTap(item.username)}>
                                                <MaterialCommunityIcons name="waveform" size={20} color={colors.accent} />
                                            </TouchableOpacity>

                                            {/* Solicitar Unirse */}
                                            <TouchableOpacity 
                                                style={[styles.actionBtn, styles.actionBtnPrimary]} 
                                                onPress={() => handleRequestJoin(item.username)}
                                            >
                                                <Octicons name="people" size={18} color={colors.background} />
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                )}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}