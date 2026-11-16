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

interface HistorialRow {
  id: number;
  documento: string;
  nombre: string;
  tipo: 'entrada' | 'salida';
  metodo: 'peatonal' | 'vehicular';
  fecha_formateada: string;
}

export default function ConsultarHistorial() {
  const [usuario, setUsuario] = useState<UsuarioSession | null>(null);
  const [items, setItems] = useState<HistorialRow[]>([]);
  const [documento, setDocumento] = useState('');
  const [tipo, setTipo] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargar = useCallback(async () => {
    const user = await getStoredUsuario();
    setUsuario(user);
    if (!user) return;
    try {
      const params = new URLSearchParams({
        id_usuario: String(user.id_usuario),
        documento: documento.trim(),
        tipo,
      });
      const res = await fetch(`${API_BASE_URL}/historial.php?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.historial || []);
      } else {
        Alert.alert('Aviso', data.message ?? 'Sin permisos.');
      }
    } catch {
      Alert.alert('Error', 'No se pudo cargar el historial.');
    } finally {
      setLoading(false);
    }
  }, [documento, tipo]);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

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

      <Text style={styles.title}>Historial de Accesos</Text>

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Buscar documento o nombre..."
          value={documento}
          onChangeText={setDocumento}
        />
        <TouchableOpacity style={styles.filterBtn} onPress={cargar}>
          <Ionicons name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
        {['', 'entrada', 'salida'].map((t) => (
          <TouchableOpacity
            key={t || 'todos'}
            style={[styles.chip, tipo === t && styles.chipActive]}
            onPress={() => setTipo(t)}
          >
            <Text style={[styles.chipText, tipo === t && styles.chipTextActive]}>
              {t ? t.toUpperCase() : 'TODOS'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1a2a47" />
      ) : items.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={{ color: '#666' }}>
            No hay registros de entrada o salida aún.
          </Text>
        </View>
      ) : (
        items.map((item, idx) => (
          <View key={`${item.id}-${idx}`} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.nombre}</Text>
              <Text style={styles.meta}>
                Doc: {item.documento} • {item.metodo.toUpperCase()}
              </Text>
              <Text style={styles.meta}>{item.fecha_formateada}</Text>
            </View>
            <View
              style={[
                styles.pill,
                {
                  backgroundColor:
                    item.tipo === 'entrada' ? '#2e7d32' : '#c62828',
                },
              ]}
            >
              <Text style={styles.pillText}>{item.tipo.toUpperCase()}</Text>
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
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  filterBtn: {
    backgroundColor: '#1a2a47',
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRadius: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
  },
  chipActive: { backgroundColor: '#1a2a47' },
  chipText: { fontSize: 11, fontWeight: 'bold', color: '#333' },
  chipTextActive: { color: '#d4af37' },
  emptyCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
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
  pill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  pillText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
});
