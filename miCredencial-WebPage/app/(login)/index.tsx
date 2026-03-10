import { Text, Image, View } from "react-native";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "../../components/CustomButton"
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
        <View style={[styles.container, {height: "35%"}]}>
          <Text style={styles.parragraph}>
            Accede a tu credencial digital de la universidad y disfruta de sus
            beneficios.
          </Text>

          <CustomButton route="/login" text="Login" />
          <CustomButton route="/signUp" text="Sign Up" />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
