import { styles } from '../constants/tabBarstyles';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import CustomTabBarButton from './CustomTabBarButton';

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({ height: 20, width: 100 });

  const visibleRoutes = state.routes.filter((route) => {
    const opts = descriptors[route.key]?.options as Record<string, any>;
    return opts?.href !== null;
  });

  const activeRouteKey = state.routes[state.index]?.key;
  const activeVisibleIndex = Math.max(
    0,
    visibleRoutes.findIndex((r) => r.key === activeRouteKey)
  );

  const buttonWidth =
    visibleRoutes.length > 0 ? dimensions.width / visibleRoutes.length : 0;

  const onTabBarLayout = (event: LayoutChangeEvent) => {
    setDimensions({
      height: event.nativeEvent.layout.height,
      width: event.nativeEvent.layout.width,
    });
  };

  const tabPositionX = useSharedValue(0);

  useEffect(() => {
    if (buttonWidth > 0) {
      tabPositionX.value = withSpring(buttonWidth * activeVisibleIndex, {
        duration: 600,
      });
    }
  }, [activeVisibleIndex, buttonWidth, tabPositionX]);

  const animateTabPosition = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  return (
    <View style={styles.tabBarContainer} onLayout={onTabBarLayout}>
      {buttonWidth > 0 && (
        <Animated.View
          style={[
            animateTabPosition,
            {
              position: 'absolute',
              borderRadius: 30,
              marginHorizontal: 10,
              height: dimensions.height - 15,
              width: buttonWidth - 20,
              backgroundColor: '#E0E0E0',
            },
          ]}
        />
      )}
      {visibleRoutes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = route.key === activeRouteKey;

        const onPress = () => {
          tabPositionX.value = withSpring(buttonWidth * index, {
            duration: 600,
          });
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
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
