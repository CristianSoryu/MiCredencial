import { icon } from "@/constants/icons";
import { styles } from "@/constants/styles";
import { useTheme } from "@react-navigation/native";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";

import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function CustomTabBarButton({
  onPress,
  onLongPress,
  isFocused,
  routeName,
  label,
}: {
  onPress: Function;
  onLongPress: Function;
  isFocused: boolean;
  routeName: string;
  label: any;
}) {
  const { colors } = useTheme();
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 },
    );
  }, [scale, isFocused]);

  const animatedTextStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 0]);

    onPress = () => {
      scale.value = withSpring(1, { duration: 350 });
      onPress();
    };
    return {
      transform: [
        {
          scale: scaleValue,
        },
      ],
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    const top = interpolate(scale.value, [0, 1], [0, 12]);

    return {
      transform: [
        {
          scale: scaleValue,
        },
      ],
      top,
    };
  });
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      onLongPress={() => onLongPress()}
      style={styles.tabBarItem}
    >
      <Animated.View style={animatedIconStyle}>
        {icon(routeName, { color: isFocused ? colors.primary : colors.text })}
      </Animated.View>
      <Animated.Text style={[styles.paragraph, animatedTextStyle]}>
        {label}
      </Animated.Text>
    </TouchableOpacity>
  );
}
