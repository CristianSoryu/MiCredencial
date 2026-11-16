import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  API_BASE_URL,
  getStoredUsuario,
  UsuarioSession,
} from '@/constants/api';

interface PrestamoValidacion {
  area: string;
  elemento: string;
  estado: string;
  observaciones?: string;
  fecha_vencimiento?: string;
}

interface ScannedUser {
  es_temporal: boolean;
  id_usuario: string | number;
  nombre_completo: string;
  identificacion: string;
  rol: string;
  programa?: string;
  motivo?: string;
  anfitrion?: string;
  fecha_expiracion?: string;
  foto?: string | null;
  prestamos?: PrestamoValidacion[];
}

export default function EscanerCarnets() {
  const [operador, setOperador] = useState<UsuarioSession | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [scannedUser, setScannedUser] = useState<ScannedUser | null>(null);

  useEffect(() => {
    getStoredUsuario().then(setOperador);
  }, []);

  const validarCodigo = async (qrData: string) => {
    if (!operador || !qrData.trim()) return;
    setCameraActive(false);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/escaner.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'validar',
          id_operador: String(operador.id_usuario),
          qr_data: qrData.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setScannedUser(data.usuario);
      } else {
        Alert.alert('QR Inválido', data.message ?? 'No se pudo validar.');
      }
    } catch {
      Alert.alert('Error', 'No se pudo conectar al servidor.');
    } finally {
      setLoading(false);
    }
  };

  const registrarAcceso = async (
    tipo: 'entrada' | 'salida',
    metodo: 'peatonal' | 'vehicular'
  ) => {
    if (!operador || !scannedUser) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/escaner.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'registrar',
          id_operador: String(operador.id_usuario),
          id_usuario: String(scannedUser.id_usuario),
          tipo,
          metodo,
        }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert('Acceso registrado', data.message);
        setScannedUser(null);
        setManualCode('');
      } else {
        Alert.alert('Error', data.message ?? 'No se pudo registrar.');
      }
    } catch {
      Alert.alert('Error', 'Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  const abrirCamara = async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        Alert.alert(
          'Permiso denegado',
          'Activa el permiso de cámara para escanear códigos QR.'
        );
        return;
      }
    }
    setScannedUser(null);
    setCameraActive(true);
  };

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
    >
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#1a2a47" />
        <Text style={styles.backText}>Volver a Herramientas</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Escáner y Control de Acceso</Text>

      {cameraActive ? (
        <View style={styles.cameraWrap}>
          <CameraView
            style={{ width: '100%', height: 320 }}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={({ data }) => validarCodigo(data)}
          />
          <TouchableOpacity
            style={styles.cancelCamBtn}
            onPress={() => setCameraActive(false)}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              Cerrar Cámara
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.scanBtn} onPress={abrirCamara}>
          <Ionicons name="qr-code-outline" size={24} color="#fff" />
          <Text style={styles.scanBtnText}>Abrir Cámara para Escanear QR</Text>
        </TouchableOpacity>
      )}

      <View style={styles.manualCard}>
        <Text style={styles.manualLabel}>
          O validación manual (cédula o código QR):
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Ej. 1092520000"
            value={manualCode}
            onChangeText={setManualCode}
          />
          <TouchableOpacity
            style={styles.validateBtn}
            onPress={() => validarCodigo(manualCode)}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Validar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && (
        <ActivityIndicator size="large" color="#1a2a47" style={{ marginTop: 16 }} />
      )}

      {scannedUser && (
        <View style={styles.resultCard}>
          <View style={styles.userRow}>
            <Image
              style={styles.avatar}
              source={
                scannedUser.foto
                  ? { uri: scannedUser.foto }
                  : require('../../assets/images/user.png')
              }
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{scannedUser.nombre_completo}</Text>
              <Text style={styles.userMeta}>{scannedUser.identificacion}</Text>
              <Text style={styles.userRole}>
                {scannedUser.rol.toUpperCase()}
              </Text>
              {scannedUser.programa ? (
                <Text style={styles.userMeta}>{scannedUser.programa}</Text>
              ) : null}
              {scannedUser.es_temporal ? (
                <Text style={styles.userMeta}>
                  Motivo: {scannedUser.motivo} • Anfitrión: {scannedUser.anfitrion}
                </Text>
              ) : null}
            </View>
          </View>

          {scannedUser.prestamos && scannedUser.prestamos.length > 0 && (
            <View style={styles.loanSection}>
              <Text style={styles.loanHeader}>
                Estado en Bienestar y Biblioteca:
              </Text>
              {scannedUser.prestamos.map((p, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.loanAlert,
                    {
                      backgroundColor:
                        p.estado === 'vencido' ? '#ffecec' : '#e8f5e9',
                      borderColor: p.estado === 'vencido' ? '#c62828' : '#2e7d32',
                    },
                  ]}
                >
                  <Text style={{ fontWeight: 'bold', color: '#1a2a47' }}>
                    [{p.area.toUpperCase()}] {p.elemento} — {p.estado.toUpperCase()}
                  </Text>
                  {p.observaciones ? (
                    <Text style={{ fontSize: 12, color: '#444' }}>
                      {p.observaciones}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
          )}

          <Text style={styles.regTitle}>Registrar Movimiento:</Text>
          <View style={styles.btnGrid}>
            <TouchableOpacity
              style={[styles.regBtn, { backgroundColor: '#2e7d32' }]}
              onPress={() => registrarAcceso('entrada', 'peatonal')}
            >
              <Text style={styles.regText}>Entrada Peatonal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.regBtn, { backgroundColor: '#1565c0' }]}
              onPress={() => registrarAcceso('entrada', 'vehicular')}
            >
              <Text style={styles.regText}>Entrada Vehicular</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.regBtn, { backgroundColor: '#ef6c00' }]}
              onPress={() => registrarAcceso('salida', 'peatonal')}
            >
              <Text style={styles.regText}>Salida Peatonal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.regBtn, { backgroundColor: '#c62828' }]}
              onPress={() => registrarAcceso('salida', 'vehicular')}
            >
              <Text style={styles.regText}>Salida Vehicular</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f4f6f9' },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  backText: { color: '#1a2a47', fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1a2a47', marginBottom: 12 },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 14,
  },
  scanBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  cameraWrap: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 14,
    backgroundColor: '#000',
  },
  cancelCamBtn: {
    backgroundColor: '#c62828',
    paddingVertical: 12,
    alignItems: 'center',
  },
  manualCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    elevation: 2,
    marginBottom: 14,
  },
  manualLabel: { fontSize: 12, fontWeight: 'bold', color: '#555', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  validateBtn: {
    backgroundColor: '#1a2a47',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    elevation: 3,
  },
  userRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#1a2a47',
  },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#1a2a47' },
  userMeta: { fontSize: 12, color: '#555', marginTop: 2 },
  userRole: {
    marginTop: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#d4af37',
    color: '#1a2a47',
    fontWeight: 'bold',
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  loanSection: { marginTop: 14 },
  loanHeader: { fontWeight: 'bold', color: '#1a2a47', marginBottom: 6 },
  loanAlert: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 6,
  },
  regTitle: {
    marginTop: 14,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#1a2a47',
  },
  btnGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  regBtn: {
    width: '48%',
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
  },
  regText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});
