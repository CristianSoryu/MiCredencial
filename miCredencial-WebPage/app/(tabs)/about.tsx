// AboutScreen.tsx
import { CampusMapPreview } from "@/components/CampusMapPreview";
import { SocialFooter } from "@/components/SocialFooter";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../constants/styles";

export default function AboutScreen() {
  const scrollY = useSharedValue(0);

  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const scrollAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 320],
      [0, -300],
      Extrapolation.CLAMP,
    );
    const HeaderViewAnimatedStyles = useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
        scrollY.value,
        [0, 320],
        ["transparent", "gray"],
      );
      return { backgroundColor };
    });
    const TitleAnimatedStyles = (fadeIn: boolean) =>
      useAnimatedStyle(() => {
        const outputRange = fadeIn ? [0, 0, 1] : [1, 0, 0];
        const opacity = interpolate(scrollY.value, [0, 120, 320], outputRange);
        return { opacity };
      });
    const AnimatedImageStyles = useAnimatedStyle(() => {
      const scale = interpolate(scrollY.value, [0, 320], [1.4, 1], {
        extrapolateRight: Extrapolation.CLAMP,
      });
      return { transform: [{ scale }] };
    });
    return {
      transform: [
        {
          translateY,
        },
      ],
    };
  });
  return (
    <LinearGradient
      style={styles.background}
      colors={["#FF0000", "#C00000", "#8A001E"]}
    >
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={styles.background}
      >
        <Animated.View style={[styles.container, scrollAnimatedStyle]}>
          <Image
            source={require("../../assets/images/logoUniversidad.png")}
            style={styles.imageCircle}
          />
          <Text style={styles.title}>miCredencial</Text>
        </Animated.View>
        <Animated.ScrollView
          onScroll={handleScroll}
          contentContainerStyle={{
            flexGrow: 1,
            padding: 24,
            paddingBottom: 120,
          }}
        >
          <Text style={styles.subTitle}>¿Qué es miCredencial?</Text>
          <Text style={styles.paragraph}>
            miCredencial es una aplicación de carnet digital pensada para la
            Universidad Libre. Te permite identificarte como estudiante, docente
            o administrativo y acceder de forma rápida y segura a los servicios
            del campus, sin depender del carnet físico. [web:42]
          </Text>

          <Text style={styles.subTitle}>¿Qué puedes hacer con la app?</Text>
          <Text style={styles.paragraph}>
            - Mostrar tu credencial digital para ingresar al campus.{"\n"}-
            Acceder a servicios como biblioteca, laboratorios o espacios
            deportivos según tu rol. [web:42]{"\n"}- Centralizar tu
            identificación universitaria en tu teléfono, de forma cómoda y
            siempre disponible.
          </Text>

          <Text style={styles.subTitle}>¿Por qué un carnet digital?</Text>
          <Text style={styles.paragraph}>
            El carnet digital reduce el uso de plástico y papel, evita la
            reimpresión de carnets físicos, y permite actualizar datos sin
            volver a emitir tarjetas. Además, mejora la seguridad al poder
            revocar o actualizar credenciales desde sistemas centrales de la
            universidad. [web:37][web:16]
          </Text>

          <Text style={styles.subTitle}>Visión del proyecto</Text>
          <Text style={styles.paragraph}>
            El objetivo de miCredencial es convertirse en una plataforma
            integrada de acreditación universitaria: un único lugar donde los
            miembros de la comunidad puedan gestionar su identidad digital y
            futuras credenciales académicas o de acceso. [web:40]
          </Text>
          <View style={styles.container}>
            <Text style={[styles.subTitle]}>Conéctate con la Unilibre</Text>

            <Text style={styles.paragraph}>
              Universidad Libre Seccional Cúcuta{"\n"}
              Av. Canal Bogotá Margen Izquierdo, Cúcuta, Norte de Santander.
            </Text>

            <Text style={[styles.subTitle]}>Síguenos en redes:</Text>

            <SocialFooter />
            <CampusMapPreview />
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
