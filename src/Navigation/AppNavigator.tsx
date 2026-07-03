import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- PANTALLAS REALES ---
import HomeScreen from '../screens/Home/HomeScreen'; // 🚀 AQUÍ ESTÁ LA IMPORTACIÓN CLAVE

// --- Estilos ---
import { styles } from './AppNavigator.styles';

// --- CASCARONES TEMPORALES RESTANTES ---
const SearchScreen = () => (
    <View style={styles.screenContainer}>
        <Text style={styles.text}>🔍 Búsqueda Lidarr (Próximamente)</Text>
    </View>
);

const LibraryScreen = () => (
    <View style={styles.screenContainer}>
        <Text style={styles.text}>📚 Mi Biblioteca (Próximamente)</Text>
    </View>
);

const CommandScreen = () => (
    <View style={styles.screenContainer}>
        <Text style={styles.text}>⚙️ Centro de Comando (Solo Admin)</Text>
    </View>
);

// --- MOTOR DE NAVEGACIÓN ---
const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    const isAdmin = true; 

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#FFFFFF',
                tabBarInactiveTintColor: '#555555',
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName = 'ellipse';

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Search') {
                        iconName = focused ? 'search' : 'search-outline';
                    } else if (route.name === 'Library') {
                        iconName = focused ? 'library' : 'library-outline';
                    } else if (route.name === 'Command') {
                        iconName = focused ? 'server' : 'server-outline'; 
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            {/* 🚀 EL NAVEGADOR AHORA USA EL COMPONENTE IMPORTADO */}
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
            <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Buscar' }} />
            <Tab.Screen name="Library" component={LibraryScreen} options={{ title: 'Biblioteca' }} />
            
            {isAdmin && (
                <Tab.Screen 
                    name="Command" 
                    component={CommandScreen} 
                    options={{ title: 'Comando' }} 
                />
            )}
        </Tab.Navigator>
    );
}