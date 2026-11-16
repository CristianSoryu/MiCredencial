import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import {
  API_BASE_URL,
  getStoredUsuario,
  UsuarioSession,
} from '@/constants/api';

interface UsuarioEstado {
  id_usuario: string | number;
  nombres: string;
  apellidos: string;
  estado: 'activo' | 'inactivo';
  rol: string;
}

export default function EstadoCarnets() {
  const [admin, setAdmin] = useState<UsuarioSession | null>(null);
  const [usuarios, setUsuarios] = useState<UsuarioEstado[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargar = useCallback(async () => {
    const user = await getStoredUsuario();
    setAdmin(user);
    if (!user) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/admin_usuarios.php?id_admin=${encodeURIComponent(String(user.id_usuario))}`
      );
      const data = await res.json();
      if (data.success) {
        setUsuarios(data.usuarios || []);
      }
    } catch {
      Alert.alert('Error', 'No se pudo cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  const toggleEstado = async (u: UsuarioEstado) => {
    if (!admin) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin_usuarios.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_admin: String(admin.id_usuario),
          id_usuario: String(u.id_usuario),
          accion: 'toggle_estado',
        }),
      });
      const data = await res.json();
      if (data.success) {
        cargar();
      } else {
        Alert.alert('Error', data.message ?? 'No se pudo cambiar el estado.');
      }
    } catch {
      Alert.alert('Error', 'Error de conexión.');
    }
  };

  const filtrados = usuarios.filter((u) => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return true;
    return (
      String(u.id_usuario).includes(q) ||
      `${u.nombres} ${u.apellidos}`.toLowerCase().includes(q)
    );
  });

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await cargar();
            setRefreshing(false);
          }}
        />
      }
    >
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#1a2a47" />
        <Text style={styles.backText}>Volver a Herramientas</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Estado de Carnets</Text>
      <TextInput
        style={styles.search}
        placeholder="Buscar por documento o nombre..."
        value={busqueda}
        onChangeText={setBusqueda}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1a2a47" />
      ) : (
        filtrados.map((u) => {
          const activo = u.estado === 'activo';
          return (
            <View key={String(u.id_usuario)} style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>
                  {u.nombres} {u.apellidos}
                </Text>
                <Text style={styles.meta}>
                  ID: {u.id_usuario} • {u.rol}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.toggleBtn,
                  { backgroundColor: activo ? '#2e7d32' : '#c62828' },
                ]}
                onPress={() => toggleEstado(u)}
              >
                <Text style={styles.toggleText}>
                  {activo ? 'ACTIVO' : 'INACTIVO'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f4f6f9' },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  backText: { color: '#1a2a47', fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1a2a47', marginBottom: 10 },
  search: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
  },
  name: { fontSize: 15, fontWeight: 'bold', color: '#1a2a47' },
  meta: { fontSize: 12, color: '#555', marginTop: 2 },
  toggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  toggleText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});
