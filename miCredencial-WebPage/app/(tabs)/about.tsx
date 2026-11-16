import { CampusMapPreview } from '@/components/CampusMapPreview';
import { SocialFooter } from '@/components/SocialFooter';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../../constants/tabBarstyles';

const HEADER_MAX_HEIGHT = 170;
const HEADER_MIN_HEIGHT = 68;
const SCROLL_DISTANCE = 120;

export default function AboutScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const logoShiftX = -(width * 0.34);

  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      Extrapolation.CLAMP
    );
    const backgroundColor = interpolateColor(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      ['transparent', '#8A001E']
    );
    return { height, backgroundColor };
  });

  const logoAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [1.15, 0.58],
      Extrapolation.CLAMP
    );
    const translateX = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [0, logoShiftX],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateX }, { scale }],
    };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [45, SCROLL_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP
    );
    const translateX = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [30, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ translateX }],
    };
  });

  const heroTitleAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 60, 110],
      [1, 0.4, 0],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [0, -24],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={['#C00000', '#9E001B', '#6E0018']}
    >
      <View style={{ flex: 1 }}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 20,
              paddingHorizontal: 18,
              justifyContent: 'center',
            },
            headerAnimatedStyle,
          ]}
        >
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
              },
              logoAnimatedStyle,
            ]}
          >
            <Image
              source={require('../../assets/images/logoUniversidad.png')}
              style={[
                styles.imageCircle,
                { width: 76, height: 76, resizeMode: 'contain' },
              ]}
            />
          </Animated.View>

          <Animated.Text
            style={[
              localStyles.collapsedTitle,
              { left: width * 0.24 },
              titleAnimatedStyle,
            ]}
          >
            miCredencial
          </Animated.Text>

          <TouchableOpacity
            style={localStyles.backButton}
            onPress={() => router.replace('/(tabs)')}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={18} color="#fff" />
            <Text style={localStyles.backText}>Volver</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingTop: HEADER_MAX_HEIGHT + 12,
            paddingHorizontal: 20,
            paddingBottom: Math.max(insets.bottom, 16) + 24,
          }}
        >
          <Animated.View style={heroTitleAnimatedStyle}>
            <Text style={localStyles.heroTitle}>miCredencial</Text>
          </Animated.View>

          <Text style={styles.subTitle}>¿Qué es miCredencial?</Text>
          <Text style={styles.paragraph}>
            miCredencial es una aplicación de carnet digital pensada para la
            Universidad Libre. Te permite identificarte como estudiante, docente
            o administrativo y acceder de forma rápida y segura a los servicios
            del campus, sin depender del carnet físico.
          </Text>

          <Text style={styles.subTitle}>¿Qué puedes hacer con la app?</Text>
          <Text style={styles.paragraph}>
            • Mostrar tu credencial digital con QR dinámico para ingresar al campus.{'\n'}
            • Acceder a servicios como biblioteca, bienestar universitario o espacios
            deportivos según tu rol.{'\n'}
            • Centralizar tu identificación universitaria en tu teléfono, siempre disponible.
          </Text>

          <Text style={styles.subTitle}>¿Por qué un carnet digital?</Text>
          <Text style={styles.paragraph}>
            El carnet digital reduce el uso de plástico y papel, evita la
            reimpresión de carnets físicos y permite actualizar datos sin volver
            a emitir tarjetas. Además, mejora la seguridad al poder revocar o
            actualizar credenciales desde sistemas centrales de la universidad.
          </Text>

          <Text style={styles.subTitle}>Visión del proyecto</Text>
          <Text style={styles.paragraph}>
            El objetivo de miCredencial es convertirse en una plataforma
            integrada de acreditación universitaria donde los miembros de la
            comunidad gestionen su identidad digital y servicios académicos.
          </Text>

          <View style={styles.container}>
            <Text style={[styles.subTitle, { marginTop: 4, textAlign: 'center' }]}>
              Conéctate con la Unilibre
            </Text>
            <Text style={[styles.paragraph, { textAlign: 'center', marginBottom: 10 }]}>
              Universidad Libre Seccional Cúcuta{'\n'}
              Av. 4ta n.º 12n-81 - El Bosque, Cúcuta.
            </Text>
            <Text style={[styles.subTitle, { fontSize: 16, marginTop: 6 }]}>
              Síguenos en redes
            </Text>
            <SocialFooter />
            <View style={{ width: '100%', marginTop: 12 }}>
              <CampusMapPreview />
            </View>
          </View>
        </Animated.ScrollView>
      </View>
    </LinearGradient>
  );
}

const localStyles = StyleSheet.create({
  heroTitle: {
    color: '#fff',
    fontSize: 30,
    fontFamily: 'PoppinsSemiBold',
    textAlign: 'center',
    marginBottom: 12,
  },
  collapsedTitle: {
    position: 'absolute',
    color: '#fff',
    fontSize: 20,
    fontFamily: 'PoppinsSemiBold',
  },
  backButton: {
    position: 'absolute',
    right: 14,
    top: 14,
    zIndex: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  backText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
