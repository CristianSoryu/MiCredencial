import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_BASE_URL, PROGRAMAS_ACADEMICOS } from '@/constants/api';
import { formStyles } from './formStyles';

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
    <KeyboardAvoidingView
      style={formStyles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView edges={['top']} style={formStyles.compactHeader}>
        <Image
          source={require('../../assets/images/logoUniversidad.png')}
          style={formStyles.compactLogo}
          contentFit="contain"
        />
        <Text style={formStyles.compactTitle}>miCredencial</Text>
        <Text style={formStyles.compactSub}>Registro Institucional</Text>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={formStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={formStyles.heading}>Registro de Carnet Digital</Text>

        <TextInput
          style={formStyles.input}
          placeholder="Nombres"
          placeholderTextColor="#888"
          value={nombres}
          onChangeText={setNombres}
        />
        <TextInput
          style={formStyles.input}
          placeholder="Apellidos"
          placeholderTextColor="#888"
          value={apellidos}
          onChangeText={setApellidos}
        />
        <TextInput
          style={formStyles.input}
          placeholder="Correo institucional (@unilibre.edu.co)"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={formStyles.pickerWrapper}>
          <Picker selectedValue={programa} onValueChange={setPrograma}>
            <Picker.Item label="Programa académico..." value="" color="#888" />
            {PROGRAMAS_ACADEMICOS.map((prog) => (
              <Picker.Item key={prog} label={prog} value={prog} />
            ))}
          </Picker>
        </View>

        <View style={formStyles.pickerWrapper}>
          <Picker selectedValue={tipoDoc} onValueChange={setTipoDoc}>
            <Picker.Item label="Tipo de documento..." value="" color="#888" />
            <Picker.Item label="Cédula de ciudadanía" value="CC" />
            <Picker.Item label="Tarjeta de identidad" value="TI" />
            <Picker.Item label="Cédula de extranjería" value="CE" />
          </Picker>
        </View>

        <TextInput
          style={formStyles.input}
          placeholder="Número de identificación"
          placeholderTextColor="#888"
          value={documento}
          onChangeText={setDocumento}
          keyboardType="numeric"
        />
        <TextInput
          style={formStyles.input}
          placeholder="Contraseña"
          placeholderTextColor="#888"
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
        />

        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 12 }} />
        ) : (
          <TouchableOpacity style={formStyles.primaryBtn} onPress={handleSubmit}>
            <Text style={formStyles.primaryBtnText}>Registrarme</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => router.back()}
          style={formStyles.backLink}
        >
          <Text style={formStyles.backLinkText}>Volver</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Registro;
