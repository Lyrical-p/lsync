import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "../Context/ThemeContext";

type InputFieldProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address";
};
const InputField = ({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default"
}: InputFieldProps) => {
  const [hidePassword, setHidePassword] = useState<boolean>(secureTextEntry);
  const {colors} = useTheme()
  return (
    <View className="flex-row px-4 py-4 items-start justify-center border border-grey-100 rounded-full" style={{borderColor: colors.border}}>
      {icon && (
        <Ionicons
          name={icon}
          size={22}
          color={colors.textMuted}
          style={{ marginRight: 6 }}
        />
      )}
      <TextInput
        className="flex-1 text-base"
        style={{color: colors.textPrimary}}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && hidePassword}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        textContentType={secureTextEntry ? "password" : undefined}
        autoComplete={secureTextEntry ? "password" : undefined}
        keyboardType={keyboardType}
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={() => setHidePassword((prev) => !prev)}>
          <Ionicons
            name={hidePassword ? "eye-off-outline" : "eye-outline"}
            size={22}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
export default InputField;
