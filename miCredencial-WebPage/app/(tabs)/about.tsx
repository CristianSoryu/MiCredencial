import { View, Text } from "react-native";
import { styles } from "../styles";

export default function About() {
    return (
        <View style = {[styles.container, {backgroundColor: "#d04141"}]}>
            <Text style={styles.text}>About</Text>
        </View>
    );
}