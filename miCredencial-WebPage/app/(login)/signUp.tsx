import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function signUp() {
  return (
    <SafeAreaView style={[styles.background, { backgroundColor: "#f1c7c7" }]}>
      <LinearGradient
        colors={["#FF0000", "#C00000", "#8A001E"]}
        style={styles.container}
      >
        <Text style={styles.tittle}>Hello!</Text>
        <Text style={styles.parragraph}>Complete your registration to miCredencial</Text>

        <TextInput placeholder="E-mail" style={styles.input} />
         <TextInput placeholder="Usuario" style={styles.input} />
          <TextInput
            placeholder="Contraseña"
            style={styles.input}
            secureTextEntry={true}
          />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.replace("/(tabs)"); // Navigate to the login screen
          }}
        >
          <View style={styles.background}>
            <Text style={styles.buttonText}>Login</Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}
