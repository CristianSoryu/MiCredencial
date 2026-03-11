import { Href, router } from "expo-router";
import React, { useEffect } from "react";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import styles from "../constants/styles";

export default function AnimationScene({
  yInitialPos,
  route,
  setIsPressed,
}: {
  yInitialPos: number;
  route: Href;
  setIsPressed: (isPressed: boolean) => void;
}) {
  const scale = useSharedValue(0);

  const onEnd = () => {
    scale.value = withTiming(0, { duration: 0 });
  };
  const navigate = () => {
    router.push(route);
    onEnd();
  };

  const onInit = () => {
    scale.value = withTiming(1, { duration: 200 }, (finish) => {
      if (finish) {
        runOnJS(navigate)();
      }
    });
  };
  useEffect(() => {
    onInit();
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View
      style={[
        animatedStyle,
        styles.animationEscene,
        { top: yInitialPos - styles.animationEscene.height / 2 },
      ]}
    />
  );
}
