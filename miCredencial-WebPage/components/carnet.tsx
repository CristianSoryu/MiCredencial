import { styles } from '../constants/tabStyles';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
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

  // Sincroniza cuando llegue la foto del servidor
  React.useEffect(() => {
    if (foto) setFotoLocal(foto);
  }, [foto]);

  const handleFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.5,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setFotoLocal(base64);

      await fetch(
        'http://192.168.137.1/MiCredencial/miCredencial-Backend/api/carnet/upload_foto.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_usuario: id, foto: base64 }),
        }
      );
    }
  };

  return (
    <View style={styles.card}>
      {/* Parte superior del carnet */}
      <View style={styles.topCard}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logoCarnet}
            source={require('../assets/images/logoUniversidad.png')}
          />
        </View>
        <View style={styles.universidadContainer}>
          <Text style={styles.uniName}>Universidad Libre</Text>
          <Text style={styles.secName}>Seccional cucuta</Text>
        </View>
        <View style={styles.roleContainer}>
          <Text style={styles.roleText}>{tipoUsuario}</Text>
        </View>
      </View>
      {/*información adicional */}
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
            <Ionicons name="camera" size={20} color={'#fff'} />
          </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Nombre: {nombre}</Text>
          <Text style={styles.infoText}>ID: {id}</Text>
          <Text style={styles.infoText}>Programa: {programa}</Text>
        </View>
      </View>
      <Qr cedula={id} />
    </View>
  );
};

export default Carnet;
