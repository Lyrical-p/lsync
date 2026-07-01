import { socialImages } from "@/src/Data/socialImages";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import PrimaryButton from "../Buttons/PrimaryButton";
import SocialButton from "../Buttons/SocialButton";
import InputField from "../Forms/InputField";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { google } = socialImages;
  return (
    <View className="px-4 gap-4 mt-8">
      <Text className="text-[16px] font-bold text-center text-gray-700">
        Sign In to Your Account
      </Text>
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
      <TouchableOpacity onPress={() => console.log("ForgotPassword Pressed")}>
        <Text className="text-base font-semibold text-green-500 text-right">
          Forgot Password?
        </Text>
      </TouchableOpacity>
      <PrimaryButton
        title="Login"
        onPress={() => console.log("Login Pressed")}
      />
      <View className="flex-row items-center justify-center">
        <View className="flex-1 h-[1px] bg-gray-300" />
        <Text className="text-base text-gray-700 mx-4">or Continue with</Text>
        <View className="flex-1 h-[1px] bg-gray-300" />
      </View>

      <SocialButton
        title="Google"
        image={google}
        onPress={() => console.log("Google Pressed")}
      />
    </View>
  );
};
export default LoginScreen;
