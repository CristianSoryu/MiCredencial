import FallingButton from "@/components/fallingButton";
import { View } from "react-native";
import { styles } from "../styles";
export default function Index() {
  return (
    <View style={styles.container}>
      <FallingButton titulo="sign in"></FallingButton>
    </View>
  );
}
