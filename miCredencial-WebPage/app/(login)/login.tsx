import { Text, TextInput } from "react-native";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "../../components/CustomButton";

export default function Login() {
  

  return (
    <SafeAreaView style={[styles.background, { backgroundColor: "#f1c7c7" }]}>
      <LinearGradient
        colors={["#FF0000", "#C00000", "#8A001E"]}
        style={styles.container}
      >
        <Text style={styles.tittle}>Welcome again!</Text>
        <Text style={styles.parragraph}>Welcome to miCredencial</Text>


        <TextInput placeholder="Usuario" style={styles.input} />
        <TextInput
          placeholder="Contraseña"
          style={styles.input}
          secureTextEntry={true}
        />
        <CustomButton route="/" text="Login" />
      </LinearGradient>
    </SafeAreaView>
  );
}
