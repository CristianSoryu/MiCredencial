import { icon } from '@/constants/icons';
import { styles } from '../constants/tabBarstyles';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export default function CustomTabBarButton({
  onPress,
  onLongPress,
  isFocused,
  routeName,
  label,
}: {
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  routeName: string;
  label: any;
}) {
  const scale = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, { damping: 16, stiffness: 160 });
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.12]);
    return {
      transform: [{ scale: scaleValue }],
    };
  });

  const activeColor = '#C00000';
  const inactiveColor = '#4b5563';

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabBarItem}
      activeOpacity={0.75}
    >
      <Animated.View style={animatedIconStyle}>
        {icon(routeName, { color: isFocused ? activeColor : inactiveColor })}
      </Animated.View>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[
          localStyles.label,
          {
            color: isFocused ? activeColor : inactiveColor,
            fontWeight: isFocused ? '700' : '500',
          },
        ]}
      >
        {String(label)}
      </Text>
    </TouchableOpacity>
  );
}

const localStyles = StyleSheet.create({
  label: {
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
});
