import { Href, useFocusEffect } from "expo-router";
import { useEffect, useState } from "react";
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
  isPressed,
  setIsPressed,
}: {
  titulo: string;
  index: Href;
  isPressed: boolean;
  setIsPressed: (isPressed: boolean) => void;
}) {
  const yFinalPosition = 10;
  const yPosition = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const width = useSharedValue(styles.button.width);
  const borderRadius = useSharedValue(styles.button.borderRadius);
  const textScaleValue = useSharedValue(1);

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

  const onPress = () => {
    textScaleValue.value = withSpring(0, { duration: 100 });
    borderRadius.value = withSpring(999, { duration: 100 });

    width.value = withTiming(
      styles.button.height,
      { duration: 300 },
      (finished) => {
        if (finished) {
          yPosition.value = withSpring(
            yPosition.value - 50,
            { duration: 500 },
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

  const defaultStyle = () => {
    textScaleValue.value = withSpring(1, { duration: 500 });
    width.value = withSpring(styles.button.width, { duration: 500 });
    borderRadius.value = withSpring(styles.button.borderRadius, {
      duration: 200,
    });
    scaleX.value = withSpring(1, { duration: 500 });
    scaleY.value = withSpring(1, { duration: 500 }, (finished) => {
      if (finished) {
        yPosition.value = withSpring(0, { duration: 500 });
      }
    });
  };

  useEffect(() => {
    if (!isPressed) {
      defaultStyle();
      setShowScene(false);
    }
  }, [isPressed]);

  useFocusEffect(defaultStyle);

  return (
    <>
      <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
        <Animated.View
          style={[
            styles.button,
            animatedButton,
            {
              position: "absolute",
            },
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
