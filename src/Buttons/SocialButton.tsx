
import React from "react";
import {
    Image,
    ImageSourcePropType,
    Text,
    TouchableOpacity
} from "react-native";
import { useTheme } from "../Context/ThemeContext";

type SocialButtonProps = {
  title: string;
  image: ImageSourcePropType;
  onPress: () => void;
};

const SocialButton = ({ title, image, onPress }: SocialButtonProps) => {
  const {colors} = useTheme()
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row justify-center w-full px-4 py-4 border rounded-full"
      style={{borderColor: colors.border}}
    >
      <Image source={image} className="w-10 h-6" resizeMode="contain" />
      <Text className="text-base font-semibold " style={{color: colors.textPrimary}}>SignIn with {title}</Text>
    </TouchableOpacity>
  );
};
export default SocialButton;
