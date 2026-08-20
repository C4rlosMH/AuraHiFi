import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import TrackPlayer from 'react-native-track-player';
import { Vibration } from 'react-native';
import { navidromeApi } from '../services/navidromeApi';
import { AuthContext } from './AuthContext'; // Ajusta la ruta si es necesario

export interface NowPlayingData {
    isPlaying: boolean;
    songTitle?: string;
    artistName?: string;
    albumArt?: string;
    trackId?: string;
    displayName?: string;
    isHostingTune?: boolean;
}

export interface ActiveUser {
    username: string;
    socketId?: string; // (Opcional, si lo guardas en el front)
    presence: NowPlayingData & { updatedAt: number }; // Aquí es donde TS te marcaba el error
}

interface SocketContextProps {
    socket: Socket | null;
    isConnected: boolean;
    updatePresence: (data: NowPlayingData) => void;
    activeUsers: ActiveUser[];

    isHostingTune: boolean;
    startTune: () => void;
    stopTune: () => void;

    isAnyTuneActive: boolean;
}

export const SocketContext = createContext<SocketContextProps>({
    socket: null,
    isConnected: false,
    updatePresence: () => {},
    activeUsers: [],
    isHostingTune: false,
    startTune: () => {},
    stopTune: () => {},
    isAnyTuneActive: false,
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    // Extraemos el usuario actual del contexto de autenticación
    const { user } = useContext(AuthContext); 
    
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

    const [realName, setRealName] = useState<string>('');
    const [isHostingTune, setIsHostingTune] = useState(false);
    const isAnyTuneActive = activeUsers.some(u => u.username !== user && u.presence.isHostingTune);

    useEffect(() => {
        // Como 'user' ya es el string del nombre, solo validamos que exista
        if (!user) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
                setActiveUsers([]);
            }
            return;
        }

        navidromeApi.getUser(user).then((userData) => {
            // Si Navidrome no nos da el 'name', usamos el username limpio o el correo
            const nameToDisplay = userData?.name || user;
            setRealName(nameToDisplay);
        });

        const MINIBACK_URL = process.env.EXPO_PUBLIC_MINIBACK_URL;

        // Pasamos 'user' directamente en la autenticación
        const newSocket = io(MINIBACK_URL, {
            auth: { username: user }, 
            transports: ['websocket'],
        });

        newSocket.on('connect', () => {
            console.log(`🔌 Conectado al Miniback con ID: ${newSocket.id}`);
            setIsConnected(true);
            
            // Apenas nos conectamos, mandamos un estado inicial (inactivo)
            newSocket.emit('presence:update', { isPlaying: false });
            newSocket.emit('presence:request_all');
        });

        newSocket.on('presence:sync_all', (entries: [string, any][]) => {
            const parsedUsers = entries.map(([username, presence]) => ({
                username,
                presence
            }));
            setActiveUsers(parsedUsers);
        });

        newSocket.on('resonar:receive_tap', async (data: { from: string }) => {
            console.log(`⚡ Interferencia táctil y de audio recibida de: ${data.from}`);
            
            Vibration.vibrate([0, 70, 50, 90]);
            
            // --- CONTROLES DE LA DISTORSIÓN ---
            const DROP_TIME = 250;       // Milisegundos que dura la parte grave/lenta
            const REBOUND_TIME = 150;    // Milisegundos que dura el rebote agudo
            
            const VOLUME_DROP = 0.1;     // Qué tanto baja el volumen (0.1 = 10% del original, 0 = silencio)
            const RATE_GRAVE = 0.4;      // Velocidad de caída (0.4 = 40% de la velocidad, más grave)
            const RATE_AGUDO = 1.5;      // Velocidad de rebote (1.7 = 170% de la velocidad, más agudo)
            // ----------------------------------

            try {
                const currentVolume = await TrackPlayer.getVolume();

                // FASE 1: Caída de tensión profunda
                await TrackPlayer.setVolume(currentVolume * VOLUME_DROP);
                await TrackPlayer.setRate(RATE_GRAVE); 
                
                await new Promise(resolve => setTimeout(resolve, DROP_TIME));

                // FASE 2: Rebote eléctrico
                await TrackPlayer.setVolume(currentVolume * 0.8); // Sube el volumen un poco para que el agudo golpee
                await TrackPlayer.setRate(RATE_AGUDO); 
                
                await new Promise(resolve => setTimeout(resolve, REBOUND_TIME));

                // FASE 3: Estabilización inmediata
                await TrackPlayer.setRate(1.0);
                await TrackPlayer.setVolume(currentVolume);

            } catch (error) {
                console.log("Error al aplicar la distorsión de audio:", error);
            }
        });
        newSocket.on('disconnect', () => {
            console.log('🔴 Desconectado del Miniback');
            setIsConnected(false);
        });
         
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    // Función para que el reproductor avise qué está sonando
    const updatePresence = (data: NowPlayingData) => {
        if (socket && isConnected) {
            // Inyectamos el nombre real automáticamente en cada paquete
            socket.emit('presence:update', {
                ...data,
                displayName: realName || user // Fallback de seguridad
            });
        }
    };

    const startTune = () => {
        if (socket && isConnected) {
            console.log('📻 Iniciando transmisión del Tune...');
            socket.emit('tune:start');
            setIsHostingTune(true);
        }
    };

    const stopTune = () => {
        if (socket && isConnected) {
            console.log('🛑 Deteniendo transmisión del Tune...');
            socket.emit('tune:stop');
            setIsHostingTune(false);
        }
    };

    return (
        <SocketContext.Provider value={{ 
            socket, isConnected, activeUsers, updatePresence, 
            isHostingTune, startTune, stopTune,
            isAnyTuneActive // 🚀 La exportamos al resto de la app
        }}>
            {children}
        </SocketContext.Provider>
    );
}