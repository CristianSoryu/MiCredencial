import { LayoutChangeEvent, View } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { styles } from "@/constants/styles";
import CustomTabBarButton from "./tabBarButton";
import { useState } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({height : 20, width: 100})
  const buttonWidth = dimensions.width / state.routes.length;
  const onTabBarLayout = (event: LayoutChangeEvent) => {
    setDimensions({
      height: event.nativeEvent.layout.height,
      width: event.nativeEvent.layout.width,
    });
  };

  const tabPositionX = useSharedValue(0);

  const animateTabPosition = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });
  return (
    <View style={styles.tabBarContainer} onLayout={onTabBarLayout}>
      <Animated.View style={[
        animateTabPosition,{ 
        position: "absolute", 
        borderRadius: 30,
        marginHorizontal: 10,
        height: dimensions.height - 15,
        width: buttonWidth - 20,
        backgroundColor: "#E0E0E0",
        }]} />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          tabPositionX.value = withSpring(buttonWidth * index, {duration: 1500});
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,

          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <CustomTabBarButton
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            label={label}
          />
        );
      })}
    </View>
  );
}
