import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
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

interface SolicitudRow {
  id: number;
  nombres: string;
  identificacion: string;
  correo: string;
  programa_academico: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  fecha_solicitud: string;
}

export default function SolicitudesEgresados() {
  const [admin, setAdmin] = useState<UsuarioSession | null>(null);
  const [solicitudes, setSolicitudes] = useState<SolicitudRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargar = useCallback(async () => {
    const user = await getStoredUsuario();
    setAdmin(user);
    if (!user) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/admin_egresados.php?id_admin=${encodeURIComponent(String(user.id_usuario))}`
      );
      const data = await res.json();
      if (data.success) {
        setSolicitudes(data.solicitudes || []);
      } else {
        Alert.alert('Aviso', data.message ?? 'Sin permisos.');
      }
    } catch {
      Alert.alert('Error', 'No se pudo cargar las solicitudes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  const actualizar = async (id: number, estado: 'aprobado' | 'rechazado') => {
    if (!admin) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin_egresados.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_admin: String(admin.id_usuario),
          id,
          estado,
        }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert('Actualizado', data.message);
        cargar();
      } else {
        Alert.alert('Error', data.message ?? 'No se pudo actualizar.');
      }
    } catch {
      Alert.alert('Error', 'Error de conexión.');
    }
  };

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

      <Text style={styles.title}>Solicitudes Egresados NG</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1a2a47" />
      ) : solicitudes.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={{ color: '#666' }}>
            No hay solicitudes registradas aún.
          </Text>
        </View>
      ) : (
        solicitudes.map((s) => (
          <View key={s.id} style={styles.card}>
            <Text style={styles.name}>{s.nombres}</Text>
            <Text style={styles.meta}>
              Doc: {s.identificacion} • {s.correo}
            </Text>
            <Text style={styles.meta}>{s.programa_academico}</Text>
            <Text style={styles.meta}>
              Fecha: {s.fecha_solicitud} • Estado:{' '}
              <Text style={{ fontWeight: 'bold' }}>{s.estado.toUpperCase()}</Text>
            </Text>

            {s.estado === 'pendiente' && (
              <View style={styles.rowBtns}>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: '#2e7d32' }]}
                  onPress={() => actualizar(s.id, 'aprobado')}
                >
                  <Text style={styles.btnText}>Aprobar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: '#c62828' }]}
                  onPress={() => actualizar(s.id, 'rechazado')}
                >
                  <Text style={styles.btnText}>Rechazar</Text>
                </TouchableOpacity>
              </View>
            )}
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
  title: { fontSize: 22, fontWeight: 'bold', color: '#1a2a47', marginBottom: 12 },
  emptyCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
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
  rowBtns: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btn: { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});
