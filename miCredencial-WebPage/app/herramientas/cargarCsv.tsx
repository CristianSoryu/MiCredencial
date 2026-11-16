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
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  API_BASE_URL,
  getStoredUsuario,
  UsuarioSession,
} from '@/constants/api';

export default function CargarCsv() {
  const [admin, setAdmin] = useState<UsuarioSession | null>(null);
  const [archivoNombre, setArchivoNombre] = useState<string | null>(null);
  const [archivoUri, setArchivoUri] = useState<string | null>(null);
  const [csvManual, setCsvManual] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);

  useEffect(() => {
    getStoredUsuario().then(setAdmin);
  }, []);

  const seleccionarArchivo = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'text/comma-separated-values', '*/*'],
        copyToCacheDirectory: true,
      });
      if (!res.canceled && res.assets[0]) {
        const asset = res.assets[0];
        setArchivoNombre(asset.name);
        setArchivoUri(asset.uri);
      }
    } catch {
      Alert.alert('Error', 'No se pudo abrir el selector de archivos.');
    }
  };

  const subirArchivo = async () => {
    if (!admin) return;
    if (!archivoUri && !csvManual.trim()) {
      Alert.alert(
        'Falta archivo',
        'Selecciona un archivo .csv o pega líneas CSV abajo.'
      );
      return;
    }

    setLoading(true);
    setResultado(null);
    try {
      let res: Response;
      if (archivoUri) {
        const formData = new FormData();
        formData.append('id_admin', String(admin.id_usuario));
        formData.append('csvFile', {
          uri: archivoUri,
          name: archivoNombre || 'usuarios.csv',
          type: 'text/csv',
        } as any);

        res = await fetch(`${API_BASE_URL}/admin_csv.php`, {
          method: 'POST',
          body: formData,
        });
      } else {
        res = await fetch(`${API_BASE_URL}/admin_csv.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_admin: String(admin.id_usuario),
            csv_content: csvManual.trim(),
          }),
        });
      }

      const data = await res.json();
      setResultado(data.message);
      if (data.success) {
        Alert.alert('Carga completada', data.message);
      } else {
        Alert.alert('Error', data.message ?? 'Error procesando CSV.');
      }
    } catch {
      Alert.alert('Error', 'No se pudo enviar el CSV al servidor.');
    } finally {
      setLoading(false);
    }
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

      <View style={styles.card}>
        <Text style={styles.title}>Cargar Preregistro CSV</Text>
        <Text style={styles.sub}>
          Formato columnas:{'\n'}
          tipo_documento, documento, nombres, apellidos, correo (@unilibre.edu.co), programa_academico
        </Text>

        <TouchableOpacity style={styles.pickBtn} onPress={seleccionarArchivo}>
          <Ionicons name="document-attach-outline" size={22} color="#1a2a47" />
          <Text style={styles.pickText}>
            {archivoNombre ? `Archivo: ${archivoNombre}` : 'Seleccionar archivo .csv'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.orText}>— o pega contenido CSV directamente —</Text>

        <TextInput
          style={styles.textArea}
          placeholder="CC,1090999888,Ana,Perez,ana.perez@unilibre.edu.co,Derecho"
          value={csvManual}
          onChangeText={setCsvManual}
          multiline
        />

        {loading ? (
          <ActivityIndicator size="large" color="#1a2a47" style={{ marginTop: 12 }} />
        ) : (
          <TouchableOpacity style={styles.uploadBtn} onPress={subirArchivo}>
            <Text style={styles.uploadText}>Procesar e Importar</Text>
          </TouchableOpacity>
        )}

        {resultado ? <Text style={styles.resultText}>{resultado}</Text> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f4f6f9' },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  backText: { color: '#1a2a47', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 18, elevation: 3 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1a2a47' },
  sub: { fontSize: 12, color: '#555', marginVertical: 10, lineHeight: 18 },
  pickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#1a2a47',
    borderRadius: 10,
    padding: 16,
    backgroundColor: '#f9fafc',
  },
  pickText: { color: '#1a2a47', fontWeight: 'bold' },
  orText: { textAlign: 'center', color: '#888', marginVertical: 12, fontSize: 12 },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 90,
    textAlignVertical: 'top',
    marginBottom: 14,
  },
  uploadBtn: {
    backgroundColor: '#1a2a47',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  uploadText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  resultText: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    borderRadius: 8,
    fontWeight: '600',
  },
});
