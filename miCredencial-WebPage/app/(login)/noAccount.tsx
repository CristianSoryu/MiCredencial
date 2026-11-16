import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formStyles } from './formStyles';

export default function NoAccount() {
  return (
    <View style={formStyles.screen}>
      <SafeAreaView edges={['top']} style={formStyles.compactHeader}>
        <Image
          source={require('../../assets/images/logoUniversidad.png')}
          style={formStyles.compactLogo}
          contentFit="contain"
        />
        <Text style={formStyles.compactTitle}>miCredencial</Text>
        <Text style={formStyles.compactSub}>Universidad Libre • Seccional Cúcuta</Text>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={[
          formStyles.scrollContent,
          { justifyContent: 'center' },
        ]}
      >
        <Text style={formStyles.heading}>Elige una opción para continuar</Text>

        <TouchableOpacity
          style={formStyles.actionCard}
          onPress={() => router.push('/renovacionSolicitud')}
        >
          <Text style={formStyles.actionCardTitle}>Egresados no graduados</Text>
          <Text style={formStyles.actionCardSub}>Renovación / Solicitud</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={formStyles.actionCard}
          onPress={() => router.push('/registro')}
        >
          <Text style={formStyles.actionCardTitle}>¿Sin cuenta?</Text>
          <Text style={formStyles.actionCardSub}>Realiza tu registro</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={formStyles.backLink}
          onPress={() => router.back()}
        >
          <Text style={formStyles.backLinkText}>Volver al inicio de sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
