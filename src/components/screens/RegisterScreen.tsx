import React, { useState } from "react";
import { Text, View } from "react-native";
import PrimaryButton from "../Buttons/PrimaryButton";
import InputField from "../Forms/InputField";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <View className="px-4 gap-4 mt-8">
      <Text className="text-[16px] font-bold text-center text-gray-700">
        Create an Account
      </Text>
      <InputField
        icon="person-outline"
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      <InputField
        icon="mail-outline"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />
      <InputField
        icon="lock-closed"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <InputField
        icon="lock-closed"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <PrimaryButton
        title="Sign Up"
        onPress={() => console.log("Sign Up Pressed")}
      />
      {/* <View className="flex-row items-center justify-center">
        <View className="flex-1 h-[1px] bg-gray-300" />
        <Text className="text-base text-gray-700 mx-4">or Continue with</Text>
        <View className="flex-1 h-[1px] bg-gray-300" />
      </View> */}
    </View>
  );
};
export default RegisterScreen;
