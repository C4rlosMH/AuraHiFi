import React from 'react';
import { View, Text } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons, Octicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import { colors } from '../styles/theme';

// --- PANTALLAS REALES ---
import HomeScreen from '../screens/Home/HomeScreen';
import LibraryScreen from '../screens/Library/LibraryScreen';
import CollectionDetailScreen from '../screens/CollactionDetailScreen/CollectionDetailScreen'; 
import ArtistDetailScreen from '../screens/ArtistDetail/ArtistDetailScreen';
import MathResultScreen from '../screens/MathResult/MathResultScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
// 🚀 NUEVA IMPORTACIÓN
import SettingsMainScreen from '../screens/Settings/SettingsMainScreen';
import AudioSettingsScreen from '../screens/Settings/AudioSettings/AudioSettingsScreen';
import StorageSettingsScreen from '../screens/Settings/StorageSettings/StorageSettingsScreen';

// --- Estilos ---
import { styles } from './AppNavigator.styles';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

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
const RootStack = createNativeStackNavigator(); // 🚀 NUEVO STACK RAIZ

function HomeStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeMain" component={HomeScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="CollectionDetail" component={CollectionDetailScreen} />
            <Stack.Screen name="ArtistDetail" component={ArtistDetailScreen} />
        </Stack.Navigator>
    );
}

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

// 🚀 ENCAPSULAMOS LAS TABS EN SU PROPIO COMPONENTE
function MainTabs() {
    const isAdmin = true; 

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: colors.light, 
                tabBarInactiveTintColor: colors.textMuted, 
                tabBarIcon: ({ focused, color, size }) => {
                    if (route.name === 'Home') {
                        return (
                            <Octicons
                                name={focused ? 'home-fill' : 'home'}
                                size={size}
                                color={color}
                            />
                        );
                    }

                    let iconName: IoniconName = 'ellipse';

                    if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
                    else if (route.name === 'Library') iconName = focused ? 'albums' : 'albums-outline';
                    else if (route.name === 'Command') iconName = focused ? 'server' : 'server-outline';

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeStackNavigator} options={{ title: 'Inicio' }} />
            <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Buscar' }} />
            <Tab.Screen name="Library" component={LibraryStackNavigator} options={{ title: 'Biblioteca' }} />
            
            {isAdmin && (
                <Tab.Screen name="Command" component={CommandScreen} options={{ title: 'Comando' }} />
            )}
        </Tab.Navigator>
    );
}

// 🚀 EL NAVEGADOR PRINCIPAL AHORA ES EL ROOT STACK
export default function AppNavigator() {
    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            {/* Las pestañas son la pantalla base */}
            <RootStack.Screen name="MainTabs" component={MainTabs} />
            {/* Settings flota por encima de todo */}
            <RootStack.Screen name="SettingsMain" component={SettingsMainScreen} />
            <RootStack.Screen name="AudioSettings" component={AudioSettingsScreen} />
            <RootStack.Screen name="StorageSettings" component={StorageSettingsScreen} />
        </RootStack.Navigator>
    );
}