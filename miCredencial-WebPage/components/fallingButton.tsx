import { TouchableOpacity } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { styles } from "../constants/styles";

export default function FallingButton({ titulo }: { titulo: string }) {
  const yPosition = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const width = useSharedValue(styles.button.width);
  const borderRadius = useSharedValue(styles.button.borderRadius);
  const textScaleValue = useSharedValue(1);

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
    width.value = withSpring(styles.button.height, { duration: 100 });
    textScaleValue.value = interpolate(textScaleValue.value, [1, 0], [0, 1]);
    borderRadius.value = withSpring(9999, { duration: 100 });
    scaleY.value = withSpring(1, { duration: 500 });
    scaleX.value = withSpring(1, { duration: 500 }, (finished) => {
      if (finished) {
        yPosition.value = withSpring(
          yPosition.value - 50,
          { duration: 500 },
          (finished) => {
            if (finished) {
              yPosition.value = withSpring(400, { duration: 1500 });
            }
          },
        );
      }
    });
  };

  const DefaultOnPress = () => {
    width.value = withSpring(styles.button.width, { duration: 500 });
    borderRadius.value = withSpring(10, { duration: 200 });
    scaleX.value = withSpring(1, { duration: 500 });
    scaleY.value = withSpring(1, { duration: 500 }, (finished) => {
      if (finished) {
        yPosition.value = withSpring(0, { duration: 500 });
      }
    });
  };
  return (
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
  );
}
