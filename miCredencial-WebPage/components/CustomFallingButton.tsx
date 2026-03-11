import { Href, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { styles } from "../constants/styles";
import AnimationScene from "./CustomAnimationScene";

export default function FallingButton({
  titulo,
  index,
}: {
  titulo: string;
  index: Href;
}) {
  const yFinalPosition = 30;
  const yPosition = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const width = useSharedValue(styles.button.width);
  const borderRadius = useSharedValue(styles.button.borderRadius);
  const textScaleValue = useSharedValue(1);
  const [isPressed, setIsPressed] = useState(false);
  const [showScene, setShowScene] = useState(false);

  const animatedButton = useAnimatedStyle(() => {
    return {
      borderRadius: borderRadius.value,
      width: width.value,
      transform: [
        { translateY: yPosition.value },
        { scaleX: scaleX.value },
        { scaleY: scaleY.value },
      ],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: textScaleValue.value,
        },
      ],
    };
  });

  const OnPress = () => {
    textScaleValue.value = withSpring(0, { duration: 100 });
    borderRadius.value = withSpring(999, { duration: 100 });

    width.value = withTiming(
      styles.button.height,
      { duration: 300 },
      (finished) => {
        if (finished) {
          yPosition.value = withSpring(
            yPosition.value - 50,
            { duration: 100 },
            (finished) => {
              if (finished) {
                yPosition.value = withSpring(
                  yFinalPosition,
                  { duration: 1000 },
                  (finish) => {
                    if (finish) {
                      runOnJS(setShowScene)(true);
                    }
                  },
                );
              }
            },
          );
        }
      },
    );
  };

  const defaultStyle = useCallback (() => {
    textScaleValue.value = withSpring(1, { duration: 20 });
    width.value = withSpring(styles.button.width, { duration: 110 });
    borderRadius.value = withSpring(styles.button.borderRadius, {
      duration: 100,
    });
    scaleX.value = withSpring(1, { duration: 20 });
    scaleY.value = withSpring(1, { duration: 20 }, (finished) => {
      if (finished) {
        yPosition.value = withSpring(0, { duration: 10 });
      }
    });
    runOnJS(setShowScene)(false);
  }, []);

  useEffect(() => {
    if (!isPressed) {
      defaultStyle();
      setShowScene(false);
    }
  }, [isPressed]);

  useFocusEffect(defaultStyle);

  return (
    <>
      <TouchableOpacity onPress={OnPress} style={styles.buttonContainer}>
        <Animated.View
          style={[
            styles.button,
            animatedButton,
          ]}
        >
          <Animated.Text style={[styles.buttonText, animatedTextStyle]}>
            {titulo}
          </Animated.Text>
        </Animated.View>
      </TouchableOpacity>
      {showScene && (
        <AnimationScene
          route={index}
          yInitialPos={yFinalPosition}
          setIsPressed={setIsPressed}
        />
      )}
    </>
  );
}
