import { Text, Image, View, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";

export default function login() {
  const router = useRouter();
  const goToRoute = (route: "login"| "signup") => {
    route === "login" ? router.push("/login") : router.push("/signUp");
  }

  return (
    <LinearGradient
      style={styles.background}
      colors={["#FF0000", "#C00000", "#8A001E"]}
    >
      <SafeAreaView style={styles.background}>
        <Image
          source={require("../../assets/images/logoUniversidad.png")}
          style={styles.imageCircle}
        />

        <Text style={styles.tittle}>miCredencial</Text>
        <View style={[styles.container, { height: "40%", backgroundColor: "#cccccc50", borderWidth: 0 }]} >
        <Text style={styles.parragraph}>
          Accede a tu credencial digital de la universidad y disfruta de sus
          beneficios.
        </Text>
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => {
            router.push("/login"); // Navigate to the login screen
          }}
          >
          <LinearGradient //boton de login
            colors={["#C00000", "#8A001E"]}
            style={[styles.background, { borderRadius: 40 }]}
            >
            <Text style={styles.buttonText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => {
            goToRoute("signup"); // Navigate to the signup screen
          }}
          >
          <LinearGradient //boton de registro
            colors={["#C00000", "#8A001E"]}
            style={[styles.background, { borderRadius: 40 }]}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </LinearGradient>
        </TouchableOpacity>
            </View>

      </SafeAreaView>
    </LinearGradient>
  );
}
