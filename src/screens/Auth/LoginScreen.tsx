import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import AuraBackground from '../../components/AuraBackground/AuraBackground';
import { styles } from './LoginScreen.styles';
import { colors } from '../../styles/theme';
import aura_logo from '../../assets/aura-lossless.png';

export default function LoginScreen() {
    const navigation = useNavigation<any>();
    const { login } = useContext(AuthContext);
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            setError('Por favor llena todos los campos');
            return;
        }

        setIsLoading(true);
        setError('');

        const success = await login(username.trim(), password);
        
        if (!success) {
            setError('Credenciales incorrectas o servidor inalcanzable');
            setIsLoading(false);
        }
        // Si es exitoso, el AuthContext actualiza el estado y el enrutador cambiará la pantalla automáticamente
    };

    return (
        <AuraBackground>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}

                
            >
                <View style={styles.logoContainer}>
                    <Image source={aura_logo} style={styles.logoImage} resizeMode="contain" />
                </View>
                <View style={styles.brandContainer}>
                    <Text style={styles.brandTitle}>AURA</Text>
                    <Text style={styles.brandSubtitle}>Hi-Fi</Text>
                </View>

                <View style={styles.frostedCard}>
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Usuario</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej. carlos"
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

                    <TouchableOpacity 
                        style={styles.loginButton} 
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={colors.background} />
                        ) : (
                            <Text style={styles.loginButtonText}>INICIAR SESIÓN</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    style={styles.switchModeButton}
                    onPress={() => navigation.navigate('SignUp')}
                >
                    <Text style={styles.switchModeText}>
                        ¿No tienes una cuenta? <Text style={styles.switchModeTextBold}>Regístrate</Text>
                    </Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </AuraBackground>
    );
}