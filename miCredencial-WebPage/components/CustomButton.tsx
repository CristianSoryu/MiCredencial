import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "../constants/styles";

type CustomFormProps = {
  route: string;
  text: string;
};
export default function CustomButton({ route, text }: CustomFormProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.button]}
      onPress={() => {
        router.push(route); // Navigate to the specified screen
      }}
    >
      <LinearGradient //boton de login
        colors={["#C00000", "#8A001E"]}
        style={[styles.background, { borderRadius: 40 }]}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
