import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { Picker } from '@react-native-picker/picker';
import CustomPageHeader from '@/components/customPageHeader';

const registro = () => {
  const handleSubmit = () => {
    // Aquí puedes agregar la lógica para enviar la solicitud al servidor
    alert('Solicitud enviada');
  };
  return (
    <View style={styles.backgroundApp}>
      <CustomPageHeader />
      <View style={[styles.content, { bottom: '3%' }]}>
        <Text style={[styles.parragraph, { marginTop: 50 }]}>
          Registro de carnet
        </Text>
        <TextInput style={styles.input} placeholder="Nombre completo" />
        <TextInput style={styles.input} placeholder="Correo institucional" />
        <View style={styles.input}>
          <Picker selectedValue={'0'}>
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
        <View style={styles.input}>
          <Picker selectedValue={''}>
            <Picker.Item label="Tipo de documento..." value="" color="#aaa" />

            <Picker.Item label="Cedula de ciudadanía" value="1" />
            <Picker.Item label="Tarjeta de identidad" value="2" />
            <Picker.Item label="Cedula de extranjeria" value="3" />
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Número de identificación"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Enviar solicitud</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default registro;
