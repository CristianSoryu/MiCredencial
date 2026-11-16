import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { API_BASE_URL } from '@/constants/api';
import CustomPageHeader from '../../components/customPageHeader';
import { styles } from './styles';

export const API_URL = `${API_BASE_URL}/login.php`;

export default function Index() {
  const [user, setUser] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (!user.trim() || !password.trim()) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documento: user.trim(),
          contrasena: password.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        await AsyncStorage.setItem('usuario', JSON.stringify(data.usuario));
        router.replace('/(tabs)');
      } else {
        Alert.alert(
          'Acceso denegado',
          data.message ?? data.error ?? 'Credenciales incorrectas'
        );
      }
    } catch {
      Alert.alert('Error', 'No se pudo conectar al servidor');
    } finally {
      setLoading(false);
    }
  };

  const noAccount = () => {
    router.push('/noAccount');
  };

  return (
    <View style={styles.backgroundApp}>
      <CustomPageHeader />
      <View style={styles.content}>
        <Text style={styles.parragraph}>
          Accede a tu credencial digital de la universidad y disfruta de sus
          beneficios.
        </Text>
        <TextInput
          placeholder="Identificación"
          style={styles.input}
          value={user}
          onChangeText={setUser}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Contraseña"
          secureTextEntry={true}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#1a2a47"
            style={{ marginTop: 12 }}
          />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={noAccount}>
          <Text style={styles.parragraph}>
            ¿No tienes una cuenta? Haz click aquí
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
