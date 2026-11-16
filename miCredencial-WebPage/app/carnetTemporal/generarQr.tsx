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
import { Picker } from '@react-native-picker/picker';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  API_BASE_URL,
  getStoredUsuario,
  UsuarioSession,
} from '@/constants/api';
import { card } from '../../constants/card';

interface GeneratedTicket {
  tipo: string;
  nombre: string;
  documento: string;
  motivo: string;
  fecha_expiracion: string;
  codigo_qr_base64: string;
  anfitrion: string;
}

const DURACIONES = [
  { label: '30 minutos', value: 30 },
  { label: '1 hora', value: 60 },
  { label: '2 horas', value: 120 },
  { label: '4 horas', value: 240 },
  { label: '8 horas', value: 480 },
  { label: '12 horas', value: 720 },
];

const GenerarQr = () => {
  const [usuario, setUsuario] = useState<UsuarioSession | null>(null);
  const [tipo, setTipo] = useState<'persona' | 'grupo'>('persona');
  const [nombre, setNombre] = useState('');
  const [documento, setDocumento] = useState('');
  const [motivo, setMotivo] = useState('');
  const [duracion, setDuracion] = useState(60);
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<GeneratedTicket | null>(null);

  useEffect(() => {
    getStoredUsuario().then(setUsuario);
  }, []);

  const handleGenerar = async () => {
    if (!usuario) return;
    if (!nombre.trim() || !motivo.trim()) {
      Alert.alert('Campos requeridos', 'Ingresa el nombre y el motivo.');
      return;
    }
    if (tipo === 'persona' && !documento.trim()) {
      Alert.alert(
        'Documento requerido',
        'Para persona individual debes ingresar el número de documento.'
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/carnets_temporales.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_creador: String(usuario.id_usuario),
          tipo,
          nombre: nombre.trim(),
          documento: documento.trim(),
          motivo: motivo.trim(),
          duracion,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTicket(data.carnet);
      } else {
        Alert.alert('Error', data.message ?? 'No se pudo generar el carnet.');
      }
    } catch {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTicket(null);
    setNombre('');
    setDocumento('');
    setMotivo('');
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f4f6f9' }}
      contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
    >
      <TouchableOpacity
        style={localStyles.backBtn}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color="#1a2a47" />
        <Text style={localStyles.backText}>Volver a Herramientas</Text>
      </TouchableOpacity>

      <View style={[card.container, { width: '100%', top: 0, marginTop: 8 }]}>
        <View style={card.topContainer}>
          <View style={card.logoContainer}>
            <Ionicons name="qr-code" size={36} color="#d4af37" />
          </View>
          <View style={card.universidadContainer}>
            <Text style={card.title}>Carnet Temporal</Text>
            <Text style={card.subTitle}>Pase QR para visitantes o grupos</Text>
          </View>
        </View>

        {ticket ? (
          <View style={localStyles.ticketBox}>
            <Text style={localStyles.ticketHeader}>UNIVERSIDAD LIBRE</Text>
            <Text style={localStyles.ticketSub}>Pase Temporal Autorizado</Text>

            <View style={localStyles.qrWrap}>
              <QRCode value={ticket.codigo_qr_base64} size={200} />
            </View>

            <View style={localStyles.infoLine}>
              <Text style={localStyles.infoLabel}>Visitante:</Text>
              <Text style={localStyles.infoVal}>{ticket.nombre}</Text>
            </View>
            <View style={localStyles.infoLine}>
              <Text style={localStyles.infoLabel}>Documento:</Text>
              <Text style={localStyles.infoVal}>{ticket.documento}</Text>
            </View>
            <View style={localStyles.infoLine}>
              <Text style={localStyles.infoLabel}>Motivo:</Text>
              <Text style={localStyles.infoVal}>{ticket.motivo}</Text>
            </View>
            <View style={localStyles.infoLine}>
              <Text style={localStyles.infoLabel}>Anfitrión:</Text>
              <Text style={localStyles.infoVal}>{ticket.anfitrion}</Text>
            </View>
            <View style={localStyles.infoLine}>
              <Text style={localStyles.infoLabel}>Expira:</Text>
              <Text style={[localStyles.infoVal, { color: '#c62828' }]}>
                {ticket.fecha_expiracion}
              </Text>
            </View>

            <TouchableOpacity
              style={[localStyles.submitBtn, { marginTop: 18 }]}
              onPress={resetForm}
            >
              <Text style={localStyles.submitText}>Generar Otro Pase</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ padding: 16 }}>
            <Text style={localStyles.label}>Tipo de Visitante</Text>
            <View style={localStyles.pickerBox}>
              <Picker
                selectedValue={tipo}
                onValueChange={(v) => setTipo(v)}
              >
                <Picker.Item label="Persona Individual" value="persona" />
                <Picker.Item
                  label="Grupo / Delegación (Colegio o Institución)"
                  value="grupo"
                />
              </Picker>
            </View>

            <Text style={localStyles.label}>
              {tipo === 'grupo'
                ? 'Nombre del Grupo o Institución'
                : 'Nombre del Visitante'}
            </Text>
            <TextInput
              style={localStyles.input}
              placeholder={
                tipo === 'grupo' ? 'Ej. Colegio La Salle' : 'Ej. Juan Pérez'
              }
              value={nombre}
              onChangeText={setNombre}
            />

            {tipo === 'persona' && (
              <>
                <Text style={localStyles.label}>Número de Documento</Text>
                <TextInput
                  style={localStyles.input}
                  placeholder="Ej. 1090123456"
                  value={documento}
                  onChangeText={setDocumento}
                  keyboardType="numeric"
                />
              </>
            )}

            <Text style={localStyles.label}>Motivo de la Visita</Text>
            <TextInput
              style={localStyles.input}
              placeholder="Ej. Reunión académica / Ponencia"
              value={motivo}
              onChangeText={setMotivo}
            />

            <Text style={localStyles.label}>Duración del Pase</Text>
            <View style={localStyles.pickerBox}>
              <Picker
                selectedValue={duracion}
                onValueChange={(v) => setDuracion(Number(v))}
              >
                {DURACIONES.map((d) => (
                  <Picker.Item key={d.value} label={d.label} value={d.value} />
                ))}
              </Picker>
            </View>

            {loading ? (
              <ActivityIndicator
                size="large"
                color="#1a2a47"
                style={{ marginTop: 14 }}
              />
            ) : (
              <TouchableOpacity
                style={localStyles.submitBtn}
                onPress={handleGenerar}
              >
                <Text style={localStyles.submitText}>Generar Pase QR</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  backText: { color: '#1a2a47', fontWeight: 'bold', fontSize: 14 },
  label: { fontWeight: 'bold', color: '#1a2a47', marginBottom: 6, marginTop: 8 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  pickerBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 6,
  },
  submitBtn: {
    backgroundColor: '#1a2a47',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 14,
  },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  ticketBox: { padding: 20, alignItems: 'center' },
  ticketHeader: { fontSize: 18, fontWeight: 'bold', color: '#1a2a47' },
  ticketSub: { fontSize: 12, color: '#666', marginBottom: 14 },
  qrWrap: {
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  infoLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: { fontWeight: 'bold', color: '#555', fontSize: 13 },
  infoVal: { color: '#1a2a47', fontWeight: '600', fontSize: 13, maxWidth: '62%', textAlign: 'right' },
});

export default GenerarQr;
