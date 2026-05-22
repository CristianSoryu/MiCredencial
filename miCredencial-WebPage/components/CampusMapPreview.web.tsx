import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";

export default function CampusMapPreview() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Campus Universitario</Text>
      <Text style={styles.subtitle}>Cúcuta, Norte de Santander</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          Linking.openURL(
            "https://maps.google.com/?q=Universidad+Francisco+de+Paula+Santander+Cucuta"
          )
        }
      >
        <Text style={styles.buttonText}>Ver en Google Maps</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    margin: 16,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#8A001E" },
  subtitle: { fontSize: 14, color: "#555", marginTop: 4 },
  button: {
    marginTop: 16,
    backgroundColor: "#C00000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: { color: "white", fontWeight: "bold" },
});
