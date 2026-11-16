import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { API_BASE_URL, PROGRAMAS_ACADEMICOS } from '@/constants/api';
import CustomPageHeader from '@/components/customPageHeader';
import styles from './styles';

const RenovacionSolicitud = () => {
  const [nombres, setNombres] = useState('');
  const [identificacion, setIdentificacion] = useState('');
  const [correo, setCorreo] = useState('');
  const [programa, setPrograma] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nombres.trim() || !identificacion.trim() || !correo.trim() || !programa) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/solicitud_egresado.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombres: nombres.trim(),
          identificacion: identificacion.trim(),
          correo: correo.trim().toLowerCase(),
          programa_academico: programa,
        }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert('Solicitud enviada', data.message, [
          { text: 'Aceptar', onPress: () => router.replace('/(login)') },
        ]);
      } else {
        Alert.alert('Aviso', data.message ?? 'No se pudo enviar la solicitud.');
      }
    } catch {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.backgroundApp}>
      <CustomPageHeader />
      <View style={[styles.content, { marginBottom: 140 }]}>
        <Text style={styles.parragraph}>
          Solicitud o renovación de carnet (Egresados no graduados)
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          value={nombres}
          onChangeText={setNombres}
        />
        <TextInput
          style={styles.input}
          placeholder="Número de identificación"
          value={identificacion}
          onChangeText={setIdentificacion}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.input}>
          <Picker selectedValue={programa} onValueChange={setPrograma}>
            <Picker.Item label="Programa académico..." value="" color="#aaa" />
            {PROGRAMAS_ACADEMICOS.map((prog) => (
              <Picker.Item key={prog} label={prog} value={prog} />
            ))}
          </Picker>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#1a2a47" style={{ marginTop: 12 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Enviar solicitud</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 14, alignSelf: 'center' }}
        >
          <Text style={[styles.parragraph, { fontSize: 13 }]}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default RenovacionSolicitud;
