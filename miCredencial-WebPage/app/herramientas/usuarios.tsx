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
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import {
  API_BASE_URL,
  getStoredUsuario,
  UsuarioSession,
} from '@/constants/api';

interface UsuarioRow {
  id_usuario: string | number;
  nombres: string;
  apellidos: string;
  email: string;
  estado: string;
  rol: string;
  id_rol: number;
}

interface RolRow {
  id_rol: number;
  tipo_usuario: string;
}

export default function GestionUsuarios() {
  const [admin, setAdmin] = useState<UsuarioSession | null>(null);
  const [usuarios, setUsuarios] = useState<UsuarioRow[]>([]);
  const [roles, setRoles] = useState<RolRow[]>([]);
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
        setRoles(data.roles || []);
      } else {
        Alert.alert('Aviso', data.message ?? 'Sin permisos.');
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

  const cambiarRol = async (id_usuario: string | number, id_rol: number) => {
    if (!admin) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin_usuarios.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_admin: String(admin.id_usuario),
          id_usuario: String(id_usuario),
          accion: 'cambiar_rol',
          id_rol,
        }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert('Rol actualizado', data.message);
        cargar();
      } else {
        Alert.alert('Error', data.message ?? 'No se pudo actualizar el rol.');
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
      `${u.nombres} ${u.apellidos}`.toLowerCase().includes(q) ||
      (u.email ?? '').toLowerCase().includes(q)
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

      <Text style={styles.title}>Gestionar Usuarios</Text>
      <TextInput
        style={styles.search}
        placeholder="Buscar por nombre, documento o correo..."
        value={busqueda}
        onChangeText={setBusqueda}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1a2a47" />
      ) : (
        filtrados.map((u) => (
          <View key={String(u.id_usuario)} style={styles.card}>
            <Text style={styles.name}>
              {u.nombres} {u.apellidos}
            </Text>
            <Text style={styles.meta}>
              ID: {u.id_usuario} • {u.email}
            </Text>
            <Text style={styles.meta}>
              Estado: {u.estado?.toUpperCase()} • Rol actual:{' '}
              <Text style={{ fontWeight: 'bold', color: '#1a2a47' }}>
                {u.rol}
              </Text>
            </Text>

            <View style={styles.pickerBox}>
              <Picker
                selectedValue={Number(u.id_rol)}
                onValueChange={(val) => {
                  if (Number(val) !== Number(u.id_rol)) {
                    cambiarRol(u.id_usuario, Number(val));
                  }
                }}
              >
                {roles.map((r) => (
                  <Picker.Item
                    key={r.id_rol}
                    label={r.tipo_usuario}
                    value={Number(r.id_rol)}
                  />
                ))}
              </Picker>
            </View>
          </View>
        ))
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: 'bold', color: '#1a2a47' },
  meta: { fontSize: 12, color: '#555', marginTop: 2 },
  pickerBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 10,
    backgroundColor: '#fafafa',
  },
});
