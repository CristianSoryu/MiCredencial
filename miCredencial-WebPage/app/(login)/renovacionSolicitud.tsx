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
        <Text style={formStyles.compactSub}>Egresados No Graduados</Text>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={formStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={formStyles.heading}>
          Solicitud o renovación de carnet
        </Text>

        <TextInput
          style={formStyles.input}
          placeholder="Nombre completo"
          placeholderTextColor="#888"
          value={nombres}
          onChangeText={setNombres}
        />
        <TextInput
          style={formStyles.input}
          placeholder="Número de identificación"
          placeholderTextColor="#888"
          value={identificacion}
          onChangeText={setIdentificacion}
          keyboardType="numeric"
        />
        <TextInput
          style={formStyles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#888"
          value={correo}
          onChangeText={setCorreo}
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

        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 12 }} />
        ) : (
          <TouchableOpacity style={formStyles.primaryBtn} onPress={handleSubmit}>
            <Text style={formStyles.primaryBtnText}>Enviar solicitud</Text>
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

export default RenovacionSolicitud;
