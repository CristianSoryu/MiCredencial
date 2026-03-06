import {
  Text,
  Image,
  View,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function login() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../../assets/images/backgroundLoginApp.png")}
      style={styles.background}
    >
      <SafeAreaView style={styles.background}>
        <View style={styles.background}>
          <View style={styles.background}>
            <Image
              source={require("../../assets/images/user.png")}
              style={styles.imageBackground}
            />
          </View>

          <View style={styles.background}>
            <Text style={styles.subTittle}>miCredencial</Text>
          </View>
          <View style={styles.background}></View>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "purple" }]}
            onPress={() => {
              router.push("/login"); // Navigate to the login screen
            }}
          >
            <View style={styles.background}>
              <Text style={styles.buttonText}>Login</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
