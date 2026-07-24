import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { setNavidromeCredentials } from '../services/navidromeApi';

interface AuthContextType {
    user: string | null;
    isLoading: boolean;
    login: (username: string, pass: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    login: async () => false,
    logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSession = async () => {
            try {
                // Buscamos si hay credenciales guardadas en el teléfono
                const savedUser = await SecureStore.getItemAsync('navidrome_user');
                const savedPass = await SecureStore.getItemAsync('navidrome_pass');

                if (savedUser && savedPass) {
                    // Si las hay, las inyectamos en la API y restauramos la sesión
                    setNavidromeCredentials(savedUser, savedPass);
                    setUser(savedUser);
                }
            } catch (error) {
                console.error("Error cargando sesión:", error);
            } finally {
                setIsLoading(false); // Terminamos de cargar, la app ya puede decidir qué pantalla mostrar
            }
        };

        loadSession();
    }, []);

    const login = async (username: string, pass: string): Promise<boolean> => {
        try {
            // 1. Inyectamos temporalmente para probar
            setNavidromeCredentials(username, pass);
            
            // 2. Hacemos una petición rápida al servidor (ej. un ping) para ver si la contraseña es correcta
            const { buildUrl, fetchFromNavidrome } = require('../services/navidromeApi');
            const url = buildUrl('ping');
            const response = await fetchFromNavidrome(url);

            if (response['subsonic-response']?.status === 'ok') {
                // 3. Si fue un éxito, guardamos las credenciales en la bóveda segura del teléfono
                await SecureStore.setItemAsync('navidrome_user', username);
                await SecureStore.setItemAsync('navidrome_pass', pass);
                setUser(username);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Login fallido:", error);
            return false;
        }
    };

    const logout = async () => {
        // Borramos todo del teléfono y limpiamos el estado
        await SecureStore.deleteItemAsync('navidrome_user');
        await SecureStore.deleteItemAsync('navidrome_pass');
        setNavidromeCredentials('', '');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};