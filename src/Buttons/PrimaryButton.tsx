import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { useTheme } from "../Context/ThemeContext";

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
};

const PrimaryButton = ({ title, onPress }: PrimaryButtonProps) => {
  const {colors} = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      className="justify-center items-center w-full rounded-full py-4 "
      style={{backgroundColor: colors.primary}}
    >
      <Text className="text-base font-semibold" style={{color: colors.white}}>{title}</Text>
    </TouchableOpacity>
  );
};
export default PrimaryButton;
