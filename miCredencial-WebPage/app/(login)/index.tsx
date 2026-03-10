import FallingButton from "@/components/CustomFallingButton";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";
export default function Index() {
  const [isPressed, setIsPressed] = useState(false);
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
            titulo="Log In"
            index="/(login)/login"
            setIsPressed={setIsPressed}
            isPressed={isPressed}
          />
          <FallingButton
            titulo="Sign Up"
            index="/(login)/signUp"
            setIsPressed={setIsPressed}
            isPressed={isPressed}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
