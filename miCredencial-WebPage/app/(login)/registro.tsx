import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { API_BASE_URL, PROGRAMAS_ACADEMICOS } from '@/constants/api';
import CustomPageHeader from '@/components/customPageHeader';
import { styles } from './styles';

const Registro = () => {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [programa, setPrograma] = useState('');
  const [tipoDoc, setTipoDoc] = useState('');
  const [documento, setDocumento] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (
      !nombres.trim() ||
      !apellidos.trim() ||
      !email.trim() ||
      !programa ||
      !tipoDoc ||
      !documento.trim() ||
      !contrasena.trim()
    ) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos.');
      return;
    }

    if (!email.trim().toLowerCase().endsWith('@unilibre.edu.co')) {
      Alert.alert(
        'Correo inválido',
        'El correo debe ser institucional (@unilibre.edu.co).'
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: documento.trim(),
          tipo_documento: tipoDoc,
          nombres: nombres.trim(),
          apellidos: apellidos.trim(),
          email: email.trim().toLowerCase(),
          contrasena: contrasena.trim(),
          programa_academico: programa,
        }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert('Registro exitoso', data.message, [
          { text: 'Iniciar sesión', onPress: () => router.replace('/(login)') },
        ]);
      } else {
        Alert.alert('Error', data.message ?? 'No se pudo completar el registro.');
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
        <Text style={styles.parragraph}>Registro de carnet</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombres"
          value={nombres}
          onChangeText={setNombres}
        />
        <TextInput
          style={styles.input}
          placeholder="Apellidos"
          value={apellidos}
          onChangeText={setApellidos}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo institucional (@unilibre.edu.co)"
          value={email}
          onChangeText={setEmail}
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
        <View style={styles.input}>
          <Picker selectedValue={tipoDoc} onValueChange={setTipoDoc}>
            <Picker.Item label="Tipo de documento..." value="" color="#aaa" />
            <Picker.Item label="Cédula de ciudadanía" value="CC" />
            <Picker.Item label="Tarjeta de identidad" value="TI" />
            <Picker.Item label="Cédula de extranjería" value="CE" />
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Número de identificación"
          value={documento}
          onChangeText={setDocumento}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
        />

        {loading ? (
          <ActivityIndicator size="large" color="#1a2a47" style={{ marginTop: 12 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Registrarme</Text>
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

export default Registro;
