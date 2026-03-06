import { useRouter } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, Button } from "react-native";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";

export default function Login() {
  const router = useRouter();
  const width = useSharedValue(100);
  const handlePress = () => {
    width.value = withSpring(Math.random() * 100 + 50);  };

  return (
    <SafeAreaView style={styles.background}>
      <BlurView intensity={100} style={styles.container}>
        <Text style={styles.tittle}>Hello!</Text>
        <Text style={styles.parragraph}>Welcome to miCredencial</Text>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Animated.View
            style={{
              width,
              height: 100,
              backgroundColor: "violet",
            }}
          />
          <Button onPress={handlePress} title="Click me" />
        </View>

        <TextInput placeholder="Usuario" style={styles.input} />
        <TextInput
          placeholder="Contraseña"
          style={styles.input}
          secureTextEntry={true}
        />

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
      </BlurView>
    </SafeAreaView>
  );
}
