import React, { useEffect, useRef, useState } from 'react';
import { 
    View, 
    Text, 
    Modal, 
    TouchableOpacity, 
    Image, 
    Animated, 
    Dimensions, 
    PanResponder,
    TouchableWithoutFeedback
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './AccountSidebar.styles';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.8;

interface AccountSidebarProps {
    isVisible: boolean;
    onClose: () => void;
    profilePicUrl: string;
    userName: string;
    serverName: string;
    onGoToSettings?: () => void;
}

export default function AccountSidebar({ 
    isVisible, 
    onClose, 
    profilePicUrl, 
    userName, 
    serverName,
    onGoToSettings 
}: AccountSidebarProps) {
    
    // Estado para mantener montado el modal durante la animación de salida
    const [isRendered, setIsRendered] = useState(isVisible);

    // Animaciones
    const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isVisible) {
            setIsRendered(true);
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.7, // 70% de opacidad de negro
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -SIDEBAR_WIDTH,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                })
            ]).start(() => {
                setIsRendered(false); // Desmonta el modal cuando termina la animación
            });
        }
    }, [isVisible]);

    // PanResponder para permitir arrastrar y cerrar el sidebar hacia la izquierda
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                // Solo activamos el gesto si el usuario mueve el dedo horizontalmente
                return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
            },
            onPanResponderMove: (evt, gestureState) => {
                // Solo permitimos arrastrar hacia la izquierda (valores negativos)
                if (gestureState.dx < 0) {
                    slideAnim.setValue(gestureState.dx);
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                // Si deslizó lo suficiente hacia la izquierda, o con mucha fuerza, cerramos
                if (gestureState.dx < -100 || gestureState.vx < -0.5) {
                    onClose();
                } else {
                    // Si no fue suficiente, rebota a su lugar (abierto)
                    Animated.spring(slideAnim, {
                        toValue: 0,
                        useNativeDriver: true,
                        bounciness: 10
                    }).start();
                }
            },
        })
    ).current;

    if (!isRendered) return null;

    return (
        <Modal
            visible={isRendered}
            transparent={true}
            animationType="none" // Desactivamos el nativo para usar el nuestro
            onRequestClose={onClose}
        >
            <View style={styles.overlayContainer}>
                
                {/* FONDO OSCURO ANIMADO */}
                <TouchableWithoutFeedback onPress={onClose}>
                    <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
                </TouchableWithoutFeedback>

                {/* EL PANEL LATERAL */}
                <Animated.View 
                    {...panResponder.panHandlers}
                    style={[
                        styles.sidebarContainer, 
                        { transform: [{ translateX: slideAnim }] }
                    ]}
                >
                    {/* CABECERA PERFIL */}
                    <View style={styles.profileHeader}>
                        <Image source={{ uri: profilePicUrl }} style={styles.profilePic} />
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName} numberOfLines={1}>{userName}</Text>
                            <Text style={styles.serverInfo} numberOfLines={1}>Conectado a {serverName}</Text>
                        </View>
                    </View>

                    {/* OPCIONES DEL MENÚ */}
                    <View style={styles.menuList}>
                        <TouchableOpacity style={styles.optionRow} onPress={() => console.log("Tu Cuenta")}>
                            <Ionicons name="person-outline" size={24} style={styles.optionIcon} />
                            <Text style={styles.optionText}>Perfil</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.optionRow} onPress={() => console.log("Historial")}>
                            <Ionicons name="time-outline" size={24} style={styles.optionIcon} />
                            <Text style={styles.optionText}>Estadisticas</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.optionRow} onPress={onGoToSettings}>
                            <Ionicons name="options-outline" size={24} style={styles.optionIcon} />
                            <Text style={styles.optionText}>Ajustes</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.optionRow} onPress={() => console.log("Cambiar Cuenta")}>
                            <Ionicons name="swap-horizontal-outline" size={24} style={styles.optionIcon} />
                            <Text style={styles.optionText}>Cambiar de servidor</Text>
                        </TouchableOpacity>
                    </View>

                    {/* ZONA INFERIOR */}
                    <TouchableOpacity style={styles.optionRow} onPress={() => console.log("Cerrar Sesión")}>
                        <Ionicons name="log-out-outline" size={24} style={styles.dangerIcon} />
                        <Text style={[styles.optionText, styles.optionTextDanger]}>Cerrar sesión</Text>
                    </TouchableOpacity>
                    
                    <Text style={styles.versionText}>Aura Hi-Fi v1.5.0</Text>
                </Animated.View>
            </View>
        </Modal>
    );
}