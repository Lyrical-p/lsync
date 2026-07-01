import React from "react";
import { Text, TouchableOpacity } from "react-native";

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
};

const PrimaryButton = ({ title, onPress }: PrimaryButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="justify-center items-center w-full rounded-full bg-green-400 py-4 "
    >
      <Text className="text-base font-semibold text-white">{title}</Text>
    </TouchableOpacity>
  );
};
export default PrimaryButton;
