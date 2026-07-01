import React from "react";
import {
    Image,
    ImageSourcePropType,
    Text,
    TouchableOpacity
} from "react-native";

type SocialButtonProps = {
  title: string;
  image: ImageSourcePropType;
  onPress: () => void;
};

const SocialButton = ({ title, image, onPress }: SocialButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row justify-center w-full px-4 py-4 border border-gray-300 rounded-full"
    >
      <Image source={image} className="w-10 h-6" resizeMode="contain" />
      <Text className="text-base font-semibold ">SignIn with {title}</Text>
    </TouchableOpacity>
  );
};
export default SocialButton;
