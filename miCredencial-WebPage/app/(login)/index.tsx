import { Button } from "@react-navigation/elements";
import React from "react";
import { Image, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";
export default function Index() {
  const [user, setUser] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = () => {};

  return (
    <View style={styles.backgroundApp}>
      <SafeAreaView style={styles.background}>
        <Image
          source={require("../../assets/images/logoUniversidad.png")}
          style={styles.imageCircle}
        />

        <Text style={styles.tittle}>miCredencial</Text>

        <Text style={styles.parragraph}>
          Accede a tu credencial digital de la universidad y disfruta de sus
          beneficios.
        </Text>

        <TextInput
          placeholder="Identificación"
          style={styles.input}
          value={user}
          onChangeText={setUser}
        />
        <TextInput
          placeholder="Contraseña"
          secureTextEntry={true}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <Button style={styles.button} onPress={handleSubmit}>
          continuar
        </Button>

        <Text style={styles.parragraph}>
          ¿no tienes una cuenta? Regístrate aquí.
        </Text>
      </SafeAreaView>
    </View>
  );
}
