import { ScrollView, Text, View } from "react-native";
import {styles} from "../styles";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Index() {
  return (
   <SafeAreaView>
      <ScrollView>


        <View style={[styles.container, { backgroundColor: "#d04141" }]}>
          <Text style={styles.text}>About</Text>
        </View>


      </ScrollView>
    </SafeAreaView>
  );
}