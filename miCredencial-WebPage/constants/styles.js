import { StyleSheet } from "react-native";
const buttonHeight = 60; // Define button height as a constant
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
    padding: 20,
    elevation: 5,
  },
  container: {
    borderRadius: 20,
    width: "90%",
    height: "70%",
    backgroundColor: "#e60909c9",
    alignItems: "center",
    justifyContent: "center",
    verticalAlign: "center",
    elevation: 7,
  },
  tittle: {
    color: "white",
    fontSize: 40,
    alignItems: "center",
    padding: 10,
    fontFamily: "PoppinsSemiBold",
  },
  subTittle: {
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "PoppinsSemiBold",
    padding: 30,
  },
  paragraph: {
    fontFamily: "PoppinsSemiBold",
  },
  button: {
    backgroundColor: "#C00000",
    borderRadius: 9999,
    width: 260,
    height: buttonHeight,
    margin: 20,
    justifyContent: "center",
    elevation: 5, // Added for Android shadow support
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
    height: buttonHeight, // Use the defined button height
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

  tabBarContainer: {
    position: "absolute",
    bottom: "5%",
    borderRadius: 35,
    flexDirection: "row",
    elevation: 7,
    backgroundColor: "transparent",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 60,
    paddingVertical: 10,
  },
  tabBarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animationEscene: {
    backgroundColor: "white",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    height: 1000,
    width: 1000,
    borderRadius: 99999,
    zIndex: 9999,
  },
});

export default styles;
