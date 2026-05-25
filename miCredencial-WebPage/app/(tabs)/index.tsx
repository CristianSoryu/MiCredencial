import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { styles } from '../../constants/tabStyles';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Carnet from '@/components/carnet';
import Logout from '@/components/logout';

export default function Index() {
  const [usuario, setUsuario] = React.useState({
    nombre: 'Cargando...',
    id: '',
    programa: '',
    tipoUsuario: '',
    foto: null as string | null,
  });

  React.useEffect(() => {
    AsyncStorage.getItem('usuario').then((raw) => {
      if (!raw) return;
      const { nombres, apellidos, id_usuario, tipo_usuario, programa, foto } =
        JSON.parse(raw);
      setUsuario({
        nombre: `${nombres} ${apellidos}`,
        id: String(id_usuario),
        programa: programa ?? '',
        tipoUsuario: tipo_usuario ?? '',
        foto: foto ?? null,
      });
    });
  }, []);
  return (
    <SafeAreaProvider>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.appBackGround}>
          <Carnet {...usuario} />

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
        <Logout />
      </ScrollView>
    </SafeAreaProvider>
  );
}
