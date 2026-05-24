import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function Bienestar() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.appBackGround}>
          <View style={styles.card}>
            <View style={styles.topCard}>
              <Text style={styles.uniName}>Préstamos</Text>
            </View>
            <View style={styles.prestamosContainer}>
              <Image
                style={styles.logoCarnet}
                source={require('../../assets/images/raquetas.png')}
              />
              <View style={styles.prestamosInfoContainer}>
                <Text style={styles.prestamosText}>Raquetas</Text>
                <TouchableOpacity style={styles.prestamosIcon}>
                  <Ionicons name="arrow-forward" size={20} color={'#333'} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.prestamosContainer}>
              <Image
                style={styles.logoCarnet}
                source={require('../../assets/images/PC.png')}
              />
              <View style={styles.prestamosInfoContainer}>
                <Text style={styles.prestamosText}>Computadoras</Text>
                <TouchableOpacity style={styles.prestamosIcon}>
                  <Ionicons name="arrow-forward" size={20} color={'#333'} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.prestamosContainer}>
              <Image
                style={styles.logoCarnet}
                source={require('../../assets/images/balon.png')}
              />
              <View style={styles.prestamosInfoContainer}>
                <Text style={styles.prestamosText}>Balones</Text>
                <TouchableOpacity style={styles.prestamosIcon}>
                  <Ionicons name="arrow-forward" size={20} color={'#333'} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.topCard}>
              <Text style={styles.uniName}>Mas servicios</Text>
            </View>
            <View style={styles.prestamosContainer}>
              <Image
                style={styles.logoCarnet}
                source={require('../../assets/images/cita.avif')}
              />
              <View style={styles.prestamosInfoContainer}>
                <Text style={styles.prestamosText}>Agenda tu cita</Text>
                <TouchableOpacity style={styles.prestamosIcon}>
                  <Ionicons name="arrow-forward" size={20} color={'#333'} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.prestamosContainer}>
              <Image
                style={styles.logoCarnet}
                source={require('../../assets/images/medico.png')}
              />
              <View style={styles.prestamosInfoContainer}>
                <Text style={styles.prestamosText}>¿Te enfermaste?</Text>
                <TouchableOpacity style={styles.prestamosIcon}>
                  <Ionicons name="arrow-forward" size={20} color={'#333'} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.prestamosContainer}>
              <Image
                style={styles.logoCarnet}
                source={require('../../assets/images/balon.png')}
              />
              <View style={styles.prestamosInfoContainer}>
                <Text style={styles.prestamosText}>Mas actividades</Text>
                <TouchableOpacity style={styles.prestamosIcon}>
                  <Ionicons name="arrow-forward" size={20} color={'#333'} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.topCard}>
              <Text style={styles.uniName}>Cursos</Text>
            </View>
            <View style={styles.infoContainer}>
              <Image
                style={{ flex: 1, height: 500, width: 'auto' }}
                source={require('../../assets/images/cursos.jpeg')}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
