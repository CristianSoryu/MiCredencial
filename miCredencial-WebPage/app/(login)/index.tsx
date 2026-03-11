import FallingButton from "@/components/CustomFallingButton";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";
export default function Index() {
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
        <View style={[styles.container, { height: "50%" }]}>
          <Text style={styles.parragraph}>
            Accede a tu credencial digital de la universidad y disfruta de sus
            beneficios.
          </Text>
              <FallingButton
                titulo="Sign Up"
                index="/(login)/signUp"
              />
              
              <FallingButton
                titulo="Login"
                index="/(login)/login"
              />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
