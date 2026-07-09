import React from 'react';
import { View, Text } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { colors } from '../styles/theme';


// --- PANTALLAS REALES ---
import HomeScreen from '../screens/Home/HomeScreen';
import LibraryScreen from '../screens/Library/LibraryScreen';
import CollectionDetailScreen from '../screens/CollactionDetailScreen/CollectionDetailScreen'; 
import ArtistDetailScreen from '../screens/ArtistDetail/ArtistDetailScreen';
import MathResultScreen from '../screens/MathResult/MathResultScreen';


// --- Estilos ---
import { styles } from './AppNavigator.styles';

const SearchScreen = () => (
    <View style={styles.screenContainer}>
        <Text style={styles.text}>🔍 Búsqueda Lidarr (Próximamente)</Text>
    </View>
);

const CommandScreen = () => (
    <View style={styles.screenContainer}>
        <Text style={styles.text}>⚙️ Centro de Comando (Solo Admin)</Text>
    </View>
);

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 🚀 1. CREAMOS UN STACK EXCLUSIVO PARA LA BIBLIOTECA
// Esto permite navegar profundo sin perder las pestañas ni el MiniPlayer
function LibraryStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LibraryMain" component={LibraryScreen} />
            <Stack.Screen name="CollectionDetail" component={CollectionDetailScreen} />
            <Stack.Screen name="ArtistDetail" component={ArtistDetailScreen} />
            <Stack.Screen name="MathResult" component={MathResultScreen} />
        </Stack.Navigator>
    );
}

// 🚀 2. EL NAVEGADOR PRINCIPAL AHORA SON LAS PESTAÑAS MISMAS
export default function AppNavigator() {
    const isAdmin = true; 

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: colors.light, // 🚀 Usamos el blanco del tema
                tabBarInactiveTintColor: colors.textMuted, // 🚀 Usamos el texto muteado del tema
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName = 'ellipse';

                    if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
                    else if (route.name === 'Library') iconName = focused ? 'library' : 'library-outline';
                    else if (route.name === 'Command') iconName = focused ? 'server' : 'server-outline'; 

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
            <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Buscar' }} />
            
            {/* AQUÍ INYECTAMOS EL STACK EN LUGAR DE LA PANTALLA SOLA */}
            <Tab.Screen name="Library" component={LibraryStackNavigator} options={{ title: 'Biblioteca' }} />
            
            {isAdmin && (
                <Tab.Screen name="Command" component={CommandScreen} options={{ title: 'Comando' }} />
            )}
        </Tab.Navigator>
    );
}