import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { setNavidromeCredentials, navidromeApi } from '../services/navidromeApi';
import { VirtualLibraryService } from '../services/VirtualLibraryService'; // 🚀 IMPORTAMOS EL SERVICIO

interface AuthContextType {
    user: string | null;
    isAdmin: boolean; 
    isLoading: boolean;
    login: (username: string, pass: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isAdmin: false,
    isLoading: true,
    login: async () => false,
    logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false); 
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSession = async () => {
            try {
                const savedUser = await SecureStore.getItemAsync('navidrome_user');
                const savedPass = await SecureStore.getItemAsync('navidrome_pass');

                if (savedUser && savedPass) {
                    setNavidromeCredentials(savedUser, savedPass);
                    setUser(savedUser);
                    
                    try {
                        const userInfo = await navidromeApi.getUser(savedUser);
                        setIsAdmin(userInfo?.isAdmin || false);
                        
                        // 🚀 MAGIA 1: Sincronizamos la biblioteca al abrir la app
                        await VirtualLibraryService.syncLibraryFromCloud();
                    } catch (e) {
                        console.log("No se pudo verificar el rol o sincronizar al inicio");
                    }
                }
            } catch (error) {
                console.error("Error cargando sesión:", error);
            } finally {
                setIsLoading(false); 
            }
        };

        loadSession();
    }, []);

    const login = async (username: string, pass: string): Promise<boolean> => {
        try {
            setNavidromeCredentials(username, pass);
            
            const { buildUrl, fetchFromNavidrome } = require('../services/navidromeApi');
            const url = buildUrl('ping');
            const response = await fetchFromNavidrome(url);

            if (response['subsonic-response']?.status === 'ok') {
                await SecureStore.setItemAsync('navidrome_user', username);
                await SecureStore.setItemAsync('navidrome_pass', pass);
                setUser(username);

                try {
                    const userInfo = await navidromeApi.getUser(username);
                    setIsAdmin(userInfo?.isAdmin || false);
                    
                    // 🚀 MAGIA 2: Sincronizamos la biblioteca justo después de loguearse en un cel nuevo
                    await VirtualLibraryService.syncLibraryFromCloud();
                } catch (e) {
                    setIsAdmin(false);
                }

                return true;
            }
            return false;
        } catch (error) {
            console.error("Login fallido:", error);
            return false;
        }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync('navidrome_user');
        await SecureStore.deleteItemAsync('navidrome_pass');
        setNavidromeCredentials('', '');
        setUser(null);
        setIsAdmin(false); 
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};