import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  imageBackground: {
    borderRadius: 100,
    width: 200,
    height: 200,
    marginTop: "40%",
    marginBottom: 20,
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
  },
  parragraph: {
    color: "black",
    fontSize: 15,
    textAlign: "center",
    padding: 10,
  },
  button: {
    backgroundColor: "red",
    borderRadius: 40,
    width: "80%",
    height: "9%",
    margin: 20,
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
});

export default styles;
