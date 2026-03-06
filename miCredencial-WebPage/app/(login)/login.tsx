import { useRouter } from "expo-router";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from 'expo-blur';

export default function Login() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.background}>
      <BlurView intensity={100} style={styles.container}></BlurView>
      <View style={styles.container}>
        <Text style={styles.tittle}>Hello!</Text>
        <Text style={styles.parragraph}>Welcome to miCredencial</Text>

        <TextInput placeholder="Usuario" style={styles.input} />
        <TextInput placeholder="Contraseña" style={styles.input} secureTextEntry={true} />

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "purple" }]}
                  onPress={() => {
                    router.replace("/(tabs)"); // Navigate to the login screen
                  }}
                >
                  <View style={styles.background}>
                    <Text style={styles.buttonText}>Login</Text>
                  </View>
                </TouchableOpacity>
              </View>
      
    </SafeAreaView>
  );
}