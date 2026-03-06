import { StyleSheet } from "react-native";
import { linear } from "react-native-reanimated";

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  imageCircle: {
    borderRadius: 100,
    width: 150,
    height: 150,
    marginTop: "30%",
    padding: 20,
    elevation: 5, // Added for Android shadow support
    blurRadius: 10, // Added for iOS shadow support
  },
  container: {
    borderRadius: 20,
    width: "90%",
    height: "70%",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "white",
    borderWidth: 2,
    verticalAlign: "center",
    elevation: 7, // Added for Android shadow support
    blurRadius: 10,
    
  },
  tittle: {
    color: "black",
    fontSize: 50,
    alignItems: "center",
    padding: 10,
    fontWeight: "bold",
    fontFamily: "Inter",
  },
  subTittle: {
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Inter",
    padding: 30,
  },
  parragraph: {
    color: "black",
    fontSize: 15,
    textAlign: "center",
    padding: 10,
  },
  button: {
    backgroundColor: "#C00000",
    borderRadius: 40,
    width: "80%",
    height: 40,
    margin: 20,
    justifyContent: "center",
    elevation: 5, // Added for Android shadow support
  },
  input: {
    backgroundColor: "#cccccc50", // Fix invalid color code
    borderRadius: 40,
    width: "80%",
    height: "7%",
    margin: 10,
    padding: 1,
    paddingLeft: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  line: {
    width: "80%",
    height: 1,
    backgroundColor: "#C00000",
    marginVertical: 20,
  },
});

export default styles;
