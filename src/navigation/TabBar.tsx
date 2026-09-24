// import { BottomTabBarProps } from "expo-router/js-tabs";
// import { Tabs } from "expo-router";
import type { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs/types";
import { useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import TabBarButton from "../Buttons/TabBarButton";
import { icon } from "../constants/icons";
import { useTheme } from "../Context/ThemeContext";

// type TabBarProps = Parameters<
//   NonNullable<React.ComponentProps<typeof Tabs>["tabBar"]>
// >[0];

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const {colors} = useTheme()
  const [dimensions, setDimensions] = useState({ height: 20, width: 100 });

  const buttonWidth = dimensions.width / state.routes.length;

  const onTabBarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const tabPositionX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  return (
    <View
      onLayout={onTabBarLayout}
      className="absolute flex-row bottom-[50px] justify-between items-center mx-5 px-[1px] py-[15px] rounded-[35px] shadow-m w-[90%] z-10"
      style={{backgroundColor: colors.surface}}
    >
      <Animated.View
        className="absolute rounded-[30px] mx-[12px]"
        style={[
          animatedStyle,
          { height: dimensions.height - 15, width: buttonWidth - 25, backgroundColor: colors.streakEmpty},
        ]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel === "string"
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          tabPositionX.value = withSpring(buttonWidth * index, {
            duration: 800,
          });
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
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name as keyof typeof icon}
          
            label={label}
          />
          // <TouchableOpacity
          //   key={route.name}
          //   accessibilityRole="button"
          //   accessibilityState={isFocused ? { selected: true } : {}}
          //   accessibilityLabel={options.tabBarAccessibilityLabel}
          //   testID={options.tabBarButtonTestID}
          //   onPress={onPress}
          //   onLongPress={onLongPress}
          //   className="flex-1 items-center justify-center gap-[5px]"
          // >
          //   {icon[route.name]({ color: isFocused ? "#007AFF" : "#8E8E93" })}
          //   <Text style={{ color: isFocused ? "#007AFF" : "#8E8E93" }}>
          //     {label}
          //   </Text>
          // </TouchableOpacity>
        );
      })}
    </View>
  );
};
export default TabBar;
