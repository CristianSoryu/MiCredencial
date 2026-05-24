import { styles } from '../constants/tabStyles';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface CarnetProps {
  nombre: string;
  id: string;
  programa: string;
}

const Carnet = (props: CarnetProps) => {
  const { nombre, id, programa } = props;
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
          <Text style={styles.roleText}>Estudiante</Text>
        </View>
      </View>
      {/*información adicional */}
      <View style={styles.infoRow}>
        <View style={styles.fotoUsuarioContainer}>
          <Image
            style={styles.fotoUsuario}
            source={require('../assets/images/user.png')}
          />
          <TouchableOpacity style={styles.cameraIconContainer}>
            <Ionicons name="camera" size={20} color={'#fff'} />
          </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Nombre: {nombre}</Text>
          <Text style={styles.infoText}>ID: {id}</Text>
          <Text style={styles.infoText}>Programa: {programa}</Text>
        </View>
      </View>
      <View style={styles.qrContainer}>
        <Image
          style={styles.qrImage}
          source={require('../assets/images/qr.png')}
        />
      </View>
    </View>
  );
};

export default Carnet;
