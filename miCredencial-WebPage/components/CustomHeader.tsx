import { Image } from "expo-image";
import React from "react";
import { Text } from "react-native";
import Animated, {
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../constants/styles";
export default function CustomHeader() {
  const scrollY = useSharedValue(0);

  useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 320],
      [0, -styles.header.height],
    );
    return {
      transform: [
        {
          translateY,
        },
      ],
    };
  });
  return (
    <SafeAreaView style={[styles.header]}>
      <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
        <Image
          source={require("../assets/images/logoUniversidad.png")}
          style={[styles.imageCircle, { width: 40, height: 40 }]}
        />
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          miCredencial
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}
