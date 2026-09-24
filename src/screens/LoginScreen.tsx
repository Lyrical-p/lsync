import { socialImages } from "@/src/Data/socialImages";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import PrimaryButton from "../Buttons/PrimaryButton";
import SocialButton from "../Buttons/SocialButton";
import InputField from "../constants/InputField";
import { useAuth } from "@/src/Context/AuthContext";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {signIn} = useAuth();
  const { google } = socialImages;

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }
    setError(null);
    setLoading(true);
    const {error: signInError} = await signIn(email.trim(), password);
    setLoading(false);

    if (signInError) {
      setError(signInError);
      return;
    }
    router.replace("/(tabs)")
  }; 



  return (
    <View className="px-4 gap-4 mt-8">
      {/* <KeyboardAvoidingView className="flex-1 justify-end" style={{backgroundColor:"rgba(0,0,0,0.4"}}
        behavior={Platform.OS === "ios" ? "padding":"height"}> */}
        <Text className="text-[16px] font-bold text-center text-gray-700">
          Sign In to Your Account
        </Text>
        <InputField
          icon="mail-outline"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <InputField
          icon="lock-closed"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry

        />
        {error &&(
          <Text className="text-red-600 text-sm text-center">{error}</Text>
        )}
        <TouchableOpacity onPress={() => console.log("ForgotPassword Pressed")}>
          <Text className="text-base font-semibold text-green-700 text-right">
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="small" color="#228B42"/>
        ) :
        (<PrimaryButton title="Login" onPress={handleLogin} />)}
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
      {/* </KeyboardAvoidingView> */}
    </View>
  );
};
export default LoginScreen;
