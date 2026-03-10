import FallingButton from "@/components/fallingButton";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
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

          <FallingButton titulo="sign in"></FallingButton>
          <CustomButton route="/signUp" text="Sign Up" />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
