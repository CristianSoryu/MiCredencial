import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  API_BASE_URL,
  getStoredUsuario,
  UsuarioSession,
} from '@/constants/api';

export default function CambiarContrasena() {
  const [usuario, setUsuario] = useState<UsuarioSession | null>(null);
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getStoredUsuario().then(setUsuario);
  }, []);

  const handleGuardar = async () => {
    if (!usuario) return;
    if (!actual || !nueva || !confirmar) {
      Alert.alert('Campos incompletos', 'Completa todos los campos.');
      return;
    }
    if (nueva !== confirmar) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/cambiar_contrasena.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: String(usuario.id_usuario),
          contrasena_actual: actual,
          contrasena_nueva: nueva,
        }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert('Éxito', data.message, [
          { text: 'Aceptar', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('Error', data.message ?? 'No se pudo cambiar la contraseña.');
      }
    } catch {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={{ padding: 18, paddingBottom: 60 }}
    >
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#1a2a47" />
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>Cambiar Contraseña</Text>
        <Text style={styles.sub}>
          Documento: {usuario?.id_usuario ?? '...'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Contraseña actual"
          secureTextEntry
          value={actual}
          onChangeText={setActual}
        />
        <TextInput
          style={styles.input}
          placeholder="Nueva contraseña (mín. 4 caracteres)"
          secureTextEntry
          value={nueva}
          onChangeText={setNueva}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar nueva contraseña"
          secureTextEntry
          value={confirmar}
          onChangeText={setConfirmar}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#1a2a47" style={{ marginTop: 12 }} />
        ) : (
          <TouchableOpacity style={styles.btn} onPress={handleGuardar}>
            <Text style={styles.btnText}>Actualizar Contraseña</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f4f6f9' },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  backText: { color: '#1a2a47', fontWeight: 'bold' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    elevation: 4,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1a2a47' },
  sub: { fontSize: 12, color: '#666', marginTop: 4, marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  btn: {
    backgroundColor: '#1a2a47',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
