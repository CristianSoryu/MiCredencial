import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { router } from 'expo-router';
import CustomPageHeader from '@/components/customPageHeader';

export default function noAccount() {
  const egresadosNoGraduados = () => {
    router.push('/renovacionSolicitud');
  };

  const registro = () => {
    router.push('/registro');
  };

  return (
    <View style={styles.backgroundApp}>
      <CustomPageHeader />
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.moreActionsButton}
          onPress={egresadosNoGraduados}
        >
          <Text style={[styles.buttonText, { color: '#fcb839' }]}>
            Egresados no graduados
          </Text>
          <Text style={[styles.buttonText, { color: '#000000' }]}>
            renovacion/ solicitud
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreActionsButton} onPress={registro}>
          <Text style={[styles.buttonText, { color: '#fcb839' }]}>
            ¿Sin cuenta?
          </Text>
          <Text style={[styles.buttonText, { color: '#000000' }]}>
            Realiza tu registro
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
