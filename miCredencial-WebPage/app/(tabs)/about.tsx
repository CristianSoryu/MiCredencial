import { CampusMapPreview } from '@/components/CampusMapPreview';
import { SocialFooter } from '@/components/SocialFooter';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../constants/tabBarstyles';

const HEADER_MAX_HEIGHT = 220;
const HEADER_MIN_HEIGHT = 90;
const SCROLL_DISTANCE = 160;

export default function AboutScreen() {
  const scrollY = useSharedValue(0);

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
      [1.4, 0.7],
      Extrapolation.CLAMP
    );
    const translateX = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [0, -120],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateX }, { scale }],
    };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [60, SCROLL_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP
    );
    const translateX = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [40, 0],
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
      [0, 80, 140],
      [1, 0.4, 0],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [0, -30],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <LinearGradient
      style={styles.background}
      colors={['#FF0000', '#C00000', '#8A001E']}
    >
      <SafeAreaView
        edges={['top', 'left', 'right', 'bottom']}
        style={styles.background}
      >
        {/* HEADER FIJO ANIMADO */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 20,
              paddingHorizontal: 20,
            },
            headerAnimatedStyle,
          ]}
        >
          {/* Logo centrado que se mueve a la izquierda al colapsar */}
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
                { width: 72, height: 72, resizeMode: 'contain' },
              ]}
            />
          </Animated.View>

          {/* Título que aparece al lado al colapsar */}
          <Animated.Text
            style={[
              styles.title,
              {
                position: 'absolute',
                left: 90,
                top: 0,
                bottom: 0,
                textAlignVertical: 'center',
                color: '#fff',
              },
              titleAnimatedStyle,
            ]}
          >
            miCredencial
          </Animated.Text>
        </Animated.View>

        {/* SCROLL CONTENT */}
        <Animated.ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingTop: HEADER_MAX_HEIGHT + 20,
            paddingHorizontal: 24,
            paddingBottom: 120,
          }}
        >
          {/* Título hero que desaparece al hacer scroll */}
          <Animated.View style={heroTitleAnimatedStyle}>
            <Text
              style={[
                styles.title,
                { color: '#fff', textAlign: 'center', marginBottom: 24 },
              ]}
            >
              miCredencial
            </Text>
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
            - Mostrar tu credencial digital para ingresar al campus.{'\n'}-
            Acceder a servicios como biblioteca, laboratorios o espacios
            deportivos según tu rol.{'\n'}- Centralizar tu identificación
            universitaria en tu teléfono, de forma cómoda y siempre disponible.
          </Text>

          <Text style={styles.subTitle}>¿Por qué un carnet digital?</Text>
          <Text style={styles.paragraph}>
            El carnet digital reduce el uso de plástico y papel, evita la
            reimpresión de carnets físicos, y permite actualizar datos sin
            volver a emitir tarjetas. Además, mejora la seguridad al poder
            revocar o actualizar credenciales desde sistemas centrales de la
            universidad.
          </Text>

          <Text style={styles.subTitle}>Visión del proyecto</Text>
          <Text style={styles.paragraph}>
            El objetivo de miCredencial es convertirse en una plataforma
            integrada de acreditación universitaria: un único lugar donde los
            miembros de la comunidad puedan gestionar su identidad digital y
            futuras credenciales académicas o de acceso.
          </Text>

          <View style={styles.container}>
            <Text style={styles.subTitle}>Conéctate con la Unilibre</Text>
            <Text style={styles.paragraph}>
              Universidad Libre Seccional Cúcuta{'\n'}
              Av. Canal Bogotá Margen Izquierdo, Cúcuta, Norte de Santander.
            </Text>
            <Text style={styles.subTitle}>Síguenos en redes:</Text>
            <SocialFooter />
            <CampusMapPreview />
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
