import { styles } from '../constants/tabBarstyles';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomTabBarButton from './CustomTabBarButton';

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [barWidth, setBarWidth] = useState(0);

  const visibleRoutes = state.routes.filter((route) => {
    const opts = descriptors[route.key]?.options as Record<string, any>;
    return opts?.href !== null;
  });

  const activeRoute = state.routes[state.index];
  const activeRouteKey = activeRoute?.key;
  const activeVisibleIndex = Math.max(
    0,
    visibleRoutes.findIndex((r) => r.key === activeRouteKey)
  );

  const horizontalPadding = 6;
  const usableWidth = Math.max(0, barWidth - horizontalPadding * 2);
  const buttonWidth =
    visibleRoutes.length > 0 ? usableWidth / visibleRoutes.length : 0;

  const onTabBarLayout = (event: LayoutChangeEvent) => {
    setBarWidth(event.nativeEvent.layout.width);
  };

  const tabPositionX = useSharedValue(0);

  useEffect(() => {
    if (buttonWidth > 0) {
      tabPositionX.value = withSpring(
        horizontalPadding + buttonWidth * activeVisibleIndex,
        { damping: 18, stiffness: 180 }
      );
    }
  }, [activeVisibleIndex, buttonWidth, tabPositionX]);

  const animateTabPosition = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  if (activeRoute?.name === 'about') {
    return null;
  }

  return (
    <View
      style={[
        styles.tabBarContainer,
        { bottom: Math.max(insets.bottom, 12) },
      ]}
      onLayout={onTabBarLayout}
    >
      {buttonWidth > 0 && (
        <Animated.View
          style={[
            animateTabPosition,
            {
              position: 'absolute',
              left: 0,
              top: 6,
              bottom: 6,
              borderRadius: 22,
              marginHorizontal: 4,
              width: buttonWidth - 8,
              backgroundColor: '#fce8e8',
            },
          ]}
        />
      )}
      {visibleRoutes.map((route) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = route.key === activeRouteKey;

        const onPress = () => {
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
