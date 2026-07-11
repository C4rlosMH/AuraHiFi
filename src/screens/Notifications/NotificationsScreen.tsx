import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import AuraBackground from '../../components/AuraBackground/AuraBackground';
import { styles } from './NotificationsScreen.styles';

// --- MOCK DATA: Simulación de lo que enviará tu futuro backend ---
const MOCK_NOTIFICATIONS = [
    {
        id: '1',
        type: 'jam', // Invitación a Jam
        title: 'Invitación a Jam Session',
        message: 'Carlos te ha invitado a escuchar "Synthwave Night" en vivo.',
        time: 'Hace 2 min',
        isRead: false,
    },
    {
        id: '2',
        type: 'music', // Álbum añadido
        title: 'Álbum Solicitado Disponible',
        message: 'El álbum "Random Access Memories" que pediste ya está en el servidor.',
        time: 'Hace 2 horas',
        coverUrl: 'https://picsum.photos/seed/daft/100/100', // Foto de prueba
        isRead: false,
    },
    {
        id: '3',
        type: 'system', // Sistema
        title: 'Bienvenido a Aura Hi-Fi',
        message: 'Tu conexión de alta fidelidad con el servidor Navidrome ha sido establecida.',
        time: 'Hace 1 día',
        isRead: true,
    }
];

export default function NotificationsScreen() {
    const navigation = useNavigation();
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

    // Función para renderizar el icono dependiendo del tipo de alerta
    const getIconForType = (type: string) => {
        switch (type) {
            case 'jam': return 'headset';
            case 'music': return 'musical-notes';
            case 'system': return 'server';
            default: return 'notifications';
        }
    };

    return (
        <AuraBackground>
            <View style={styles.container}>
                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color={styles.iconColor.color} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notificaciones</Text>
                    {/* Espaciador para centrar el título */}
                    <View style={styles.headerSpacer} />
                </View>

                {/* LISTA DE NOTIFICACIONES */}
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {notifications.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="notifications-off-outline" size={64} color={styles.mutedColor.color} />
                            <Text style={styles.emptyTitle}>Todo al día</Text>
                            <Text style={styles.emptySubtitle}>No tienes notificaciones nuevas por ahora.</Text>
                        </View>
                    ) : (
                        notifications.map((notif) => (
                            <TouchableOpacity 
                                key={notif.id} 
                                style={[styles.card, !notif.isRead && styles.unreadCard]}
                                activeOpacity={0.7}
                            >
                                {/* Indicador de no leído */}
                                {!notif.isRead && <View style={styles.unreadDot} />}
                                
                                {/* Icono o Imagen del Álbum */}
                                {notif.coverUrl ? (
                                    <Image source={{ uri: notif.coverUrl }} style={styles.coverImage} />
                                ) : (
                                    <View style={styles.iconContainer}>
                                        <Ionicons name={getIconForType(notif.type)} size={24} color={styles.accentColor.color} />
                                    </View>
                                )}

                                {/* Textos */}
                                <View style={styles.textContainer}>
                                    <Text style={styles.title} numberOfLines={1}>{notif.title}</Text>
                                    <Text style={styles.message} numberOfLines={2}>{notif.message}</Text>
                                    <Text style={styles.time}>{notif.time}</Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
            </View>
        </AuraBackground>
    );
}