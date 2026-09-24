import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type ThemeButtonProps = {
  title: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  onPress: () => void;
  isActive: boolean;
};

const ThemeButton = ({ title, icon, onPress, isActive }: ThemeButtonProps) => {
  return (
    <TouchableOpacity
      className="flex-row justify-between items-center bg-white rounded-lg p-[20px] mb-4"
      onPress={onPress}
    >
      <View className="flex-row items-center gap-2">
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={isActive ? "#15803d" : "#222"}
        />
        <Text className="text-sm font-medium">{title}</Text>
      </View>
      <MaterialCommunityIcons
        name={
          isActive ? "check-circle-outline" : "checkbox-blank-circle-outline"
        }
        size={20}
      />
    </TouchableOpacity>
  );
};
export default ThemeButton;
