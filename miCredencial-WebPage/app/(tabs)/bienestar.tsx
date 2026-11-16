import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { API_BASE_URL, getStoredUsuario, UsuarioSession } from '@/constants/api';
import { styles } from '../../constants/tabStyles';

interface MiPrestamo {
  id_prestamo: number;
  area: string;
  elemento: string;
  estado: 'pendiente' | 'activo' | 'rechazado' | 'devuelto' | 'vencido';
  observaciones?: string;
  fecha_solicitud: string;
  fecha_vencimiento?: string | null;
}

export default function Bienestar() {
  const insets = useSafeAreaInsets();
  const [usuario, setUsuario] = useState<UsuarioSession | null>(null);
  const [misPrestamos, setMisPrestamos] = useState<MiPrestamo[]>([]);
  const [modalElemento, setModalElemento] = useState<{
    area: 'bienestar' | 'biblioteca';
    elemento: string;
  } | null>(null);
  const [observaciones, setObservaciones] = useState('');
  const [sending, setSending] = useState(false);
  const [infoModal, setInfoModal] = useState<{
    titulo: string;
    contenido: string;
  } | null>(null);

  const cargarPrestamos = useCallback(async () => {
    const user = await getStoredUsuario();
    setUsuario(user);
    if (!user) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/prestamos.php?id_usuario=${encodeURIComponent(String(user.id_usuario))}&modo=mis_prestamos`
      );
      const data = await res.json();
      if (data.success) {
        setMisPrestamos(data.prestamos || []);
      }
    } catch {
      // Ignore
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarPrestamos();
    }, [cargarPrestamos])
  );

  const enviarSolicitud = async () => {
    if (!usuario || !modalElemento) return;
    setSending(true);
    try {
      const res = await fetch(`${API_BASE_URL}/prestamos.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'solicitar',
          id_usuario: String(usuario.id_usuario),
          area: modalElemento.area,
          elemento: modalElemento.elemento,
          observaciones: observaciones.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert('Solicitud enviada', data.message);
        setModalElemento(null);
        setObservaciones('');
        cargarPrestamos();
      } else {
        Alert.alert('Aviso', data.message ?? 'No se pudo enviar la solicitud.');
      }
    } catch {
      Alert.alert('Error', 'No se pudo conectar al servidor.');
    } finally {
      setSending(false);
    }
  };

  const badgeColor = (estado: MiPrestamo['estado']) => {
    switch (estado) {
      case 'activo':
        return '#2e7d32';
      case 'pendiente':
        return '#ef6c00';
      case 'vencido':
      case 'rechazado':
        return '#c62828';
      default:
        return '#546e7a';
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f4f6f9' }}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 16) + 96,
        }}
      >
        <View style={styles.appBackGround}>
          <View style={styles.card}>
            <View style={styles.topCard}>
              <Text style={styles.uniName}>Préstamos (Toca para solicitar)</Text>
            </View>

            <View style={{ paddingBottom: 14 }}>
              <TouchableOpacity
                style={styles.prestamosContainer}
                onPress={() =>
                  setModalElemento({
                    area: 'bienestar',
                    elemento: 'Raquetas de tennis',
                  })
                }
              >
                <Image
                  style={styles.logoCarnet}
                  source={require('../../assets/images/raquetas.png')}
                />
                <View style={styles.prestamosInfoContainer}>
                  <Text style={styles.prestamosText} numberOfLines={2}>
                    Raquetas
                  </Text>
                  <View style={styles.prestamosIcon}>
                    <Ionicons name="arrow-forward" size={18} color={'#1a2a47'} />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.prestamosContainer}
                onPress={() =>
                  setModalElemento({ area: 'bienestar', elemento: 'Portátil PC' })
                }
              >
                <Image
                  style={styles.logoCarnet}
                  source={require('../../assets/images/PC.png')}
                />
                <View style={styles.prestamosInfoContainer}>
                  <Text style={styles.prestamosText} numberOfLines={2}>
                    Portátil PC
                  </Text>
                  <View style={styles.prestamosIcon}>
                    <Ionicons name="arrow-forward" size={18} color={'#1a2a47'} />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.prestamosContainer}
                onPress={() =>
                  setModalElemento({
                    area: 'bienestar',
                    elemento: 'Balón de fútbol',
                  })
                }
              >
                <Image
                  style={styles.logoCarnet}
                  source={require('../../assets/images/balon.png')}
                />
                <View style={styles.prestamosInfoContainer}>
                  <Text style={styles.prestamosText} numberOfLines={2}>
                    Balones
                  </Text>
                  <View style={styles.prestamosIcon}>
                    <Ionicons name="arrow-forward" size={18} color={'#1a2a47'} />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.prestamosContainer,
                  { backgroundColor: '#e3f2fd', borderColor: '#64b5f6' },
                ]}
                onPress={() =>
                  setModalElemento({
                    area: 'biblioteca',
                    elemento: 'Libro Académico / Consulta',
                  })
                }
              >
                <View style={{ width: 40, alignItems: 'center' }}>
                  <Ionicons name="book" size={32} color="#1565c0" />
                </View>
                <View
                  style={[
                    styles.prestamosInfoContainer,
                    { borderLeftColor: '#64b5f6' },
                  ]}
                >
                  <Text style={styles.prestamosText} numberOfLines={2}>
                    Libro Biblioteca
                  </Text>
                  <View
                    style={[styles.prestamosIcon, { backgroundColor: '#64b5f6' }]}
                  >
                    <Ionicons name="arrow-forward" size={18} color={'#fff'} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.topCard}>
              <Text style={styles.uniName}>Mis Préstamos</Text>
            </View>
            <View style={{ padding: 14 }}>
              {misPrestamos.length === 0 ? (
                <Text style={{ color: '#777', textAlign: 'center' }}>
                  No tienes solicitudes ni préstamos registrados.
                </Text>
              ) : (
                misPrestamos.map((p) => (
                  <View key={p.id_prestamo} style={localStyles.loanRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={localStyles.loanTitle}>{p.elemento}</Text>
                      <Text style={localStyles.loanSub}>
                        Área: {p.area.toUpperCase()} • {p.fecha_solicitud}
                      </Text>
                      {p.fecha_vencimiento ? (
                        <Text style={localStyles.loanSub}>
                          Vence: {p.fecha_vencimiento}
                        </Text>
                      ) : null}
                    </View>
                    <View
                      style={[
                        localStyles.statusPill,
                        { backgroundColor: badgeColor(p.estado) },
                      ]}
                    >
                      <Text style={localStyles.statusText}>
                        {p.estado.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.topCard}>
              <Text style={styles.uniName}>Más servicios</Text>
            </View>

            <View style={{ paddingBottom: 14 }}>
              <TouchableOpacity
                style={styles.prestamosContainer}
                onPress={() =>
                  setInfoModal({
                    titulo: 'Agenda tu cita',
                    contenido:
                      'Horario de atención en Bienestar Universitario (Seccional Cúcuta):\nLunes a Viernes de 8:00 AM a 12:00 PM y 2:00 PM a 6:00 PM.\nPresenta tu carnet digital en el módulo de psicología o asesoría.',
                  })
                }
              >
                <Image
                  style={styles.logoCarnet}
                  source={require('../../assets/images/cita.avif')}
                />
                <View style={styles.prestamosInfoContainer}>
                  <Text style={styles.prestamosText} numberOfLines={2}>
                    Agenda tu cita
                  </Text>
                  <View style={styles.prestamosIcon}>
                    <Ionicons name="arrow-forward" size={18} color={'#1a2a47'} />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.prestamosContainer}
                onPress={() =>
                  setInfoModal({
                    titulo: 'Enfermería y Primeros Auxilios',
                    contenido:
                      'Si presentas malestar o emergencia dentro del campus, acércate al consultorio médico ubicado en el primer piso del bloque administrativo o comunícate con PBX (607) 582 9810.',
                  })
                }
              >
                <Image
                  style={styles.logoCarnet}
                  source={require('../../assets/images/medico.png')}
                />
                <View style={styles.prestamosInfoContainer}>
                  <Text style={styles.prestamosText} numberOfLines={2}>
                    ¿Te enfermaste?
                  </Text>
                  <View style={styles.prestamosIcon}>
                    <Ionicons name="arrow-forward" size={18} color={'#1a2a47'} />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.prestamosContainer}
                onPress={() =>
                  setInfoModal({
                    titulo: 'Actividades Deportivas y Culturales',
                    contenido:
                      'Participa en torneos internos de fútbol sala, voleibol, tenis de mesa, danzas y música. Inscripciones abiertas en la oficina de Deportes de Bienestar.',
                  })
                }
              >
                <Image
                  style={styles.logoCarnet}
                  source={require('../../assets/images/balon.png')}
                />
                <View style={styles.prestamosInfoContainer}>
                  <Text style={styles.prestamosText} numberOfLines={2}>
                    Más actividades
                  </Text>
                  <View style={styles.prestamosIcon}>
                    <Ionicons name="arrow-forward" size={18} color={'#1a2a47'} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.topCard}>
              <Text style={styles.uniName}>Cursos</Text>
            </View>
            <View style={{ padding: 12 }}>
              <Image
                style={{ width: '100%', height: 320, borderRadius: 10 }}
                resizeMode="contain"
                source={require('../../assets/images/cursos.jpeg')}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={!!modalElemento}
        transparent
        animationType="fade"
        onRequestClose={() => setModalElemento(null)}
      >
        <View style={localStyles.backdrop}>
          <View style={localStyles.modalCard}>
            <Text style={localStyles.modalTitle}>Solicitar Préstamo</Text>
            <Text style={localStyles.modalSub}>
              {modalElemento?.elemento} ({modalElemento?.area.toUpperCase()})
            </Text>
            <TextInput
              style={localStyles.input}
              placeholder="Motivo u observación (ej. Título del libro o cancha)"
              value={observaciones}
              onChangeText={setObservaciones}
              multiline
            />
            {sending ? (
              <ActivityIndicator size="small" color="#1a2a47" />
            ) : (
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  style={[localStyles.btn, { backgroundColor: '#ccc', flex: 1 }]}
                  onPress={() => setModalElemento(null)}
                >
                  <Text style={{ fontWeight: 'bold', color: '#333' }}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[localStyles.btn, { backgroundColor: '#1a2a47', flex: 1 }]}
                  onPress={enviarSolicitud}
                >
                  <Text style={{ fontWeight: 'bold', color: '#fff' }}>
                    Solicitar
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={!!infoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoModal(null)}
      >
        <View style={localStyles.backdrop}>
          <View style={localStyles.modalCard}>
            <Text style={localStyles.modalTitle}>{infoModal?.titulo}</Text>
            <Text style={{ color: '#444', marginVertical: 14, lineHeight: 20 }}>
              {infoModal?.contenido}
            </Text>
            <TouchableOpacity
              style={[localStyles.btn, { backgroundColor: '#1a2a47' }]}
              onPress={() => setInfoModal(null)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const localStyles = StyleSheet.create({
  loanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
  },
  loanTitle: { fontWeight: 'bold', color: '#1a2a47', fontSize: 14 },
  loanSub: { color: '#666', fontSize: 11, marginTop: 2 },
  statusPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a2a47' },
  modalSub: { fontSize: 13, color: '#666', marginTop: 4, marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 70,
    textAlignVertical: 'top',
    marginBottom: 14,
  },
  btn: {
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
  },
});
