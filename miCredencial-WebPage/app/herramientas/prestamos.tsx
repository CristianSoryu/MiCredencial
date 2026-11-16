import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
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

interface PrestamoGestion {
  id_prestamo: number;
  id_usuario: string | number;
  area: 'bienestar' | 'biblioteca';
  elemento: string;
  estado: 'pendiente' | 'activo' | 'rechazado' | 'devuelto' | 'vencido';
  observaciones?: string;
  fecha_solicitud: string;
  fecha_vencimiento?: string | null;
  solicitante: string;
}

const FILTROS = ['todos', 'pendiente', 'activo', 'vencido', 'devuelto', 'rechazado'] as const;

export default function GestionPrestamos() {
  const [usuario, setUsuario] = useState<UsuarioSession | null>(null);
  const [prestamos, setPrestamos] = useState<PrestamoGestion[]>([]);
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]>('todos');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [obsModal, setObsModal] = useState<{
    id_prestamo: number;
    accion: 'aprobar' | 'rechazar' | 'devolver' | 'marcar_vencido';
    elemento: string;
  } | null>(null);
  const [observacion, setObservacion] = useState('');

  const cargar = useCallback(async () => {
    const user = await getStoredUsuario();
    setUsuario(user);
    if (!user) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/prestamos.php?id_usuario=${encodeURIComponent(String(user.id_usuario))}&modo=gestion`
      );
      const data = await res.json();
      if (data.success) {
        setPrestamos(data.prestamos || []);
      } else {
        Alert.alert('Aviso', data.message ?? 'Sin acceso a préstamos.');
      }
    } catch {
      Alert.alert('Error', 'No se pudo cargar la lista de préstamos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  const ejecutarAccion = async () => {
    if (!usuario || !obsModal) return;
    try {
      const res = await fetch(`${API_BASE_URL}/prestamos.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: obsModal.accion,
          id_aprobador: String(usuario.id_usuario),
          id_prestamo: obsModal.id_prestamo,
          observaciones: observacion.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert('Actualizado', data.message);
        setObsModal(null);
        setObservacion('');
        cargar();
      } else {
        Alert.alert('Error', data.message ?? 'No se pudo actualizar.');
      }
    } catch {
      Alert.alert('Error', 'Error de conexión.');
    }
  };

  const filtrados =
    filtro === 'todos'
      ? prestamos
      : prestamos.filter((p) => p.estado === filtro);

  const badgeColor = (estado: PrestamoGestion['estado']) => {
    switch (estado) {
      case 'pendiente':
        return '#ef6c00';
      case 'activo':
        return '#2e7d32';
      case 'vencido':
      case 'rechazado':
        return '#c62828';
      default:
        return '#546e7a';
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

      <Text style={styles.title}>Gestión de Préstamos</Text>
      <Text style={styles.sub}>
        Revisa solicitudes de Bienestar / Biblioteca y aprueba, rechaza o
        registra devoluciones.
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 12 }}
      >
        {FILTROS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, filtro === f && styles.chipActive]}
            onPress={() => setFiltro(f)}
          >
            <Text
              style={[styles.chipText, filtro === f && styles.chipTextActive]}
            >
              {f.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color="#1a2a47" style={{ marginTop: 20 }} />
      ) : filtrados.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={{ color: '#666' }}>No hay préstamos en esta categoría.</Text>
        </View>
      ) : (
        filtrados.map((p) => (
          <View key={p.id_prestamo} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.elemTitle}>{p.elemento}</Text>
                <Text style={styles.meta}>
                  {p.solicitante} • ID: {p.id_usuario}
                </Text>
                <Text style={styles.meta}>
                  Área: {p.area.toUpperCase()} • {p.fecha_solicitud}
                </Text>
              </View>
              <View
                style={[styles.pill, { backgroundColor: badgeColor(p.estado) }]}
              >
                <Text style={styles.pillText}>{p.estado.toUpperCase()}</Text>
              </View>
            </View>

            {p.observaciones ? (
              <Text style={styles.obs}>Obs: {p.observaciones}</Text>
            ) : null}
            {p.fecha_vencimiento ? (
              <Text style={styles.obs}>Vence: {p.fecha_vencimiento}</Text>
            ) : null}

            <View style={styles.actionsRow}>
              {p.estado === 'pendiente' && (
                <>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#2e7d32' }]}
                    onPress={() =>
                      setObsModal({
                        id_prestamo: p.id_prestamo,
                        accion: 'aprobar',
                        elemento: p.elemento,
                      })
                    }
                  >
                    <Text style={styles.actionText}>Aprobar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#c62828' }]}
                    onPress={() =>
                      setObsModal({
                        id_prestamo: p.id_prestamo,
                        accion: 'rechazar',
                        elemento: p.elemento,
                      })
                    }
                  >
                    <Text style={styles.actionText}>Rechazar</Text>
                  </TouchableOpacity>
                </>
              )}

              {(p.estado === 'activo' || p.estado === 'vencido') && (
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: '#1a2a47' }]}
                  onPress={() =>
                    setObsModal({
                      id_prestamo: p.id_prestamo,
                      accion: 'devolver',
                      elemento: p.elemento,
                    })
                  }
                >
                  <Text style={styles.actionText}>Marcar Devuelto</Text>
                </TouchableOpacity>
              )}

              {p.estado === 'activo' && (
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: '#ef6c00' }]}
                  onPress={() =>
                    setObsModal({
                      id_prestamo: p.id_prestamo,
                      accion: 'marcar_vencido',
                      elemento: p.elemento,
                    })
                  }
                >
                  <Text style={styles.actionText}>Reportar Vencido</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))
      )}

      <Modal
        visible={!!obsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setObsModal(null)}
      >
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Confirmar: {obsModal?.accion.replace('_', ' ').toUpperCase()}
            </Text>
            <Text style={{ color: '#666', marginVertical: 6 }}>
              {obsModal?.elemento}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Observación opcional (se enviará en la notificación)"
              value={observacion}
              onChangeText={setObservacion}
              multiline
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#aaa', flex: 1 }]}
                onPress={() => setObsModal(null)}
              >
                <Text style={styles.actionText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#1a2a47', flex: 1 }]}
                onPress={ejecutarAccion}
              >
                <Text style={styles.actionText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f4f6f9' },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  backText: { color: '#1a2a47', fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1a2a47' },
  sub: { fontSize: 12, color: '#666', marginTop: 2 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginRight: 8,
  },
  chipActive: { backgroundColor: '#1a2a47' },
  chipText: { fontSize: 11, fontWeight: 'bold', color: '#333' },
  chipTextActive: { color: '#d4af37' },
  emptyCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  elemTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a2a47' },
  meta: { fontSize: 12, color: '#555', marginTop: 2 },
  obs: { fontSize: 12, color: '#333', marginTop: 6, fontStyle: 'italic' },
  pill: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 12 },
  pillText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: { width: '100%', backgroundColor: '#fff', borderRadius: 14, padding: 18 },
  modalTitle: { fontSize: 17, fontWeight: 'bold', color: '#1a2a47' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 65,
    textAlignVertical: 'top',
    marginVertical: 12,
  },
});
