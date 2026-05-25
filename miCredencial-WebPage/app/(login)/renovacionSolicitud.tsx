import React from 'react';
import { Picker } from '@react-native-picker/picker';

import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import CustomPageHeader from '@/components/customPageHeader';

const RenovacionSolicitud = () => {
  const handleSubmit = () => {
    // Aquí puedes agregar la lógica para enviar la solicitud al servidor
    alert('Solicitud enviada');
  };
  return (
    <View style={styles.backgroundApp}>
      <CustomPageHeader />
      <View style={[styles.content]}>
        <Text style={styles.parragraph}>Solicitud o renovación de carnet</Text>
        <TextInput style={styles.input} placeholder="Nombre completo" />
        <TextInput
          style={styles.input}
          placeholder="Número de identificación"
        />
        <TextInput style={styles.input} placeholder="Correo electrónico" />
        <View style={styles.input}>
          <Picker
            selectedValue={'0'}
            onValueChange={(itemValue) => console.log(itemValue)}
          >
            <Picker.Item label="Programa academico..." value="" color="#aaa" />

            <Picker.Item
              label="Ingenieria en Tecnologías de la Información y Comunicaciones"
              value="1"
            />
            <Picker.Item label="Ingenieria Civil" value="2" />
            <Picker.Item label="Ingenieria Ambiental" value="3" />
            <Picker.Item label="Ingenieria Industrial" value="4" />
            <Picker.Item label="Derecho" value="5" />
            <Picker.Item label="Contaduría" value="6" />
            <Picker.Item label="Administración de Empresas" value="7" />
          </Picker>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Enviar solicitud</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RenovacionSolicitud;
