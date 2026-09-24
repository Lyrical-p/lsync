import React, { useEffect } from "react";
import { Pressable, PressableProps } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { icon } from "../constants/icons";
import { useTheme } from "../Context/ThemeContext";

type RouteName = keyof typeof icon;

const TabBarButton = ({
  onPress,
  onLongPress,
  isFocused,
  routeName,
  label,
}: {
  onPress: PressableProps["onPress"];
  onLongPress: PressableProps["onLongPress"];
  isFocused: boolean;
  routeName: RouteName;
  label: string;
}) => {
  const scale = useSharedValue(0);
  const {colors} = useTheme()
  const activeColor = colors.primary
  const inactiveColor = colors.tabInactive


  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 },
    );
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);

    const top = interpolate(scale.value, [0, 1], [0, 9]);

    return {
      transform: [{ scale: scaleValue }],
      top,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);

    return {
      opacity,
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-1 items-center justify-center gap-[5px]"
    >
      <Animated.View style={animatedIconStyle}>
        {icon[routeName]({ color: isFocused ? activeColor : inactiveColor })}
      </Animated.View>

      <Animated.Text
        style={[
          { color: isFocused ? activeColor : inactiveColor, fontSize: 12 },
          animatedTextStyle,
        ]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
};
export default TabBarButton;
