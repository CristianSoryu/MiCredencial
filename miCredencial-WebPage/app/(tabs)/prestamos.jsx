import { Text, View } from "react-native";
import {styles} from "../styles";
import { Link } from "expo-router";
export default function Index() {
  return (
    <View style={styles.container}
    >
      <Text style={styles.text}>prestamos screen.</Text>
      <Link href="/about">Go to About</Link>
    </View>
  );
}