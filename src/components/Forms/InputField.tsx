import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

type InputFieldProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
};
const InputField = ({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
}: InputFieldProps) => {
  const [hidePassword, setHidePassword] = useState<boolean>(secureTextEntry);
  return (
    <View className="flex-row px-4 py-4 items-start justify-center border border-grey-100 rounded-full">
      {icon && (
        <Ionicons
          name={icon}
          size={22}
          color="#ccc"
          style={{ marginRight: 6 }}
        />
      )}
      <TextInput
        className="flex-1 text-base text-grey-700"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && hidePassword}
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={() => setHidePassword((prev) => !prev)}>
          <Ionicons
            name={hidePassword ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#ccc"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
export default InputField;
