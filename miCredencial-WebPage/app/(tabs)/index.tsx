import FallingButton from "@/components/CustomFallingButton";
import { View } from "react-native";
import { styles } from "../styles";
export default function Index() {
  return (
    <View style={styles.container}>
      <FallingButton titulo="sign in"></FallingButton>
    </View>
  );
}
