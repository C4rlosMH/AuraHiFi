import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { navidromeApi } from '../../services/navidromeApi';
import AuraBackground from '../../components/AuraBackground/AuraBackground';
import { styles } from './SignUpScreen.styles';
import { colors } from '../../styles/theme';

export default function SignUpScreen() {
    const navigation = useNavigation<any>();
    const { login } = useContext(AuthContext);
    
    // 🚀 NUEVOS ESTADOS
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignUp = async () => {
        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanUser = username.trim().toLowerCase();
        
        if (!cleanName || !cleanEmail || !cleanUser || !password || !confirmPassword) {
            setError("Por favor llena todos los campos.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setIsLoading(true);
        setError('');

        // 1. Mandamos a crear el usuario con los 4 parámetros
        const created = await navidromeApi.createUser(cleanUser, password, cleanName, cleanEmail);

        if (created) {
            // 2. Iniciamos sesión con el usuario técnico (username)
            const loggedIn = await login(cleanUser, password);
            if (!loggedIn) {
                setError("Cuenta creada, pero hubo un error al iniciar sesión.");
                setIsLoading(false);
            }
        } else {
            setError("Error al crear cuenta. Tal vez el usuario ya existe o el servidor no responde.");
            setIsLoading(false);
        }
    };

    return (
        <AuraBackground>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 40 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Únete a la Jam</Text>
                        <Text style={styles.subtitle}>Crea un perfil para escuchar en sincronía y mantener tu propia biblioteca.</Text>
                    </View>

                    <View style={styles.frostedCard}>
                        {error ? <Text style={{ color: '#ff4d4d', textAlign: 'center', marginBottom: 15 }}>{error}</Text> : null}

                        {/* 🚀 NUEVO: CAMPO DE NOMBRE A MOSTRAR */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Nombre a mostrar</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej. Carlos"
                                placeholderTextColor={colors.textMuted}
                                value={name}
                                onChangeText={setName}
                                autoCorrect={false}
                            />
                        </View>

                        {/* 🚀 NUEVO: CAMPO DE CORREO */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Correo Electrónico</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="tu@correo.com"
                                placeholderTextColor={colors.textMuted}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                autoCorrect={false}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Usuario (ID para login)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej. carlos99"
                                placeholderTextColor={colors.textMuted}
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Contraseña</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor={colors.textMuted}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Confirmar Contraseña</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor={colors.textMuted}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity 
                            style={styles.signupButton} 
                            onPress={handleSignUp}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={colors.background} />
                            ) : (
                                <Text style={styles.signupButtonText}>CREAR CUENTA</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity 
                        style={styles.switchModeButton}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.switchModeText}>
                            ¿Ya tienes una cuenta? <Text style={styles.switchModeTextBold}>Inicia sesión</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </AuraBackground>
    );
}