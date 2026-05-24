import React from 'react';
import { styles } from '../../constants/tabStyles';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Carnet from '@/components/carnet';

const coloresCarnet = {
  fondo: '#f4f6f9',
  texto: '#333333',
  detalles: '#d4af37',
};
export default function Index() {
  const { nombre, id, programa } = {
    nombre: 'Juan Pérez',
    id: '123456789',
    programa: 'Ingeniería de Sistemas',
  };
  return (
    <SafeAreaProvider>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.appBackGround}>
          <Carnet nombre={nombre} id={id} programa={programa} />
          <View style={styles.card}>
            <View style={styles.topCard}>
              <Text style={styles.uniName}>Carnets temporales</Text>
            </View>
            <View style={styles.infoContainer}>
              <TouchableOpacity style={styles.carnetInfoContainer}>
                <Text style={styles.infoText}>La Salle</Text>

                <View style={styles.expInfoContainer}>
                  <Text style={styles.infoText}>11:00 AM</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.carnetInfoContainer}>
                <Text style={styles.infoText}>UDES</Text>

                <View style={styles.expInfoContainer}>
                  <Text style={styles.infoText}>5:00 PM</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.topCard}>
              <Text style={styles.uniName}>Notificaciones</Text>
            </View>

            <View style={styles.infoContainer}>
              <TouchableOpacity style={styles.prestamoInfoContainer}>
                <Text style={styles.infoText}>Prestamo Vencido</Text>
                <Ionicons
                  style={styles.infoIcon}
                  name="information-circle"
                  size={20}
                  color={'#d9534f'}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.prestamoInfoContainer}>
                <Text style={styles.infoText}>Alix</Text>
                <Ionicons
                  style={styles.infoIcon}
                  name="information-circle"
                  size={20}
                  color={'#d9534f'}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.prestamoInfoContainer}>
                <Text style={styles.infoText}>Alix</Text>
                <Ionicons
                  style={styles.infoIcon}
                  name="information-circle"
                  size={20}
                  color={'#d9534f'}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.prestamoInfoContainer}>
                <Text style={styles.infoText}>Alix</Text>
                <Ionicons
                  style={styles.infoIcon}
                  name="information-circle"
                  size={20}
                  color={'#d9534f'}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.prestamoInfoContainer}>
                <Text style={styles.infoText}>Alix</Text>
                <Ionicons
                  style={styles.infoIcon}
                  name="information-circle"
                  size={20}
                  color={'#d9534f'}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.prestamoInfoContainer}>
                <Text style={styles.infoText}>Alix</Text>
                <Ionicons
                  style={styles.infoIcon}
                  name="information-circle"
                  size={20}
                  color={'#d9534f'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}
