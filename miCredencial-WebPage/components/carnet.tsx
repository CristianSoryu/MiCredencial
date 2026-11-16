import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/api';
import { styles } from '../constants/tabStyles';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import React, { useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import Qr from './qr';
import * as ImagePicker from 'expo-image-picker';

interface CarnetProps {
  nombre: string;
  id: string;
  programa: string;
  tipoUsuario: string;
  foto?: string | null;
}

const Carnet = ({ nombre, id, programa, tipoUsuario, foto }: CarnetProps) => {
  const [fotoLocal, setFotoLocal] = useState<string | null>(foto ?? null);

  React.useEffect(() => {
    if (foto) setFotoLocal(foto);
  }, [foto]);

  const handleFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso requerido',
        'Necesitamos permiso de cámara para actualizar tu foto.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.5,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setFotoLocal(base64);

      try {
        const res = await fetch(`${API_BASE_URL}/uploadPhoto.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_usuario: id, foto: base64 }),
        });
        const json = await res.json();
        if (json.success) {
          const raw = await AsyncStorage.getItem('usuario');
          if (raw) {
            const parsed = JSON.parse(raw);
            parsed.foto = base64;
            await AsyncStorage.setItem('usuario', JSON.stringify(parsed));
          }
        }
      } catch {
        Alert.alert('Aviso', 'Foto guardada localmente, pero falló la subida.');
      }
    }
  };

  const etiquetaPrograma = [
    'docente',
    'administrativo',
    'administrador',
    'seguridad',
  ].includes(tipoUsuario?.toLowerCase())
    ? 'Cargo'
    : 'Programa';

  return (
    <View style={styles.card}>
      <View style={styles.topCard}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logoCarnet}
            source={require('../assets/images/logoUniversidad.png')}
          />
        </View>
        <View style={styles.universidadContainer}>
          <Text style={styles.uniName} numberOfLines={1}>
            Universidad Libre
          </Text>
          <Text style={styles.secName} numberOfLines={1}>
            Seccional Cúcuta
          </Text>
        </View>
        <View style={styles.roleContainer}>
          <Text style={styles.roleText} numberOfLines={2}>
            {tipoUsuario ? tipoUsuario.toUpperCase() : 'USUARIO'}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.fotoUsuarioContainer}>
          <Image
            style={styles.fotoUsuario}
            source={
              fotoLocal
                ? { uri: fotoLocal }
                : require('../assets/images/user.png')
            }
          />
          <TouchableOpacity
            style={styles.cameraIconContainer}
            onPress={handleFoto}
          >
            <Ionicons name="camera" size={16} color={'#fff'} />
          </TouchableOpacity>
        </View>

        <View style={[styles.infoContainer, { paddingVertical: 2 }]}>
          <Text style={styles.infoText}>
            <Text style={{ fontWeight: 'bold', color: '#1a2a47' }}>Nombre: </Text>
            {nombre}
          </Text>
          <Text style={styles.infoText}>
            <Text style={{ fontWeight: 'bold', color: '#1a2a47' }}>ID: </Text>
            {id}
          </Text>
          <Text style={styles.infoText}>
            <Text style={{ fontWeight: 'bold', color: '#1a2a47' }}>
              {etiquetaPrograma}:{' '}
            </Text>
            {programa || 'Universidad Libre'}
          </Text>
        </View>
      </View>

      <View style={{ paddingBottom: 14 }}>
        <Qr cedula={id} />
      </View>
    </View>
  );
};

export default Carnet;
