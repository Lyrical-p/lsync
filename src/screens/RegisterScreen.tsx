import React, { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import PrimaryButton from "../Buttons/PrimaryButton";
import InputField from "../constants/InputField";
import { useAuth } from "../Context/AuthContext";
import { router } from "expo-router";
import { useTheme } from "../Context/ThemeContext";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const {signUp} = useAuth();
  const {colors} = useTheme()

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword){
      setError("Fill in every field.");
      return
    }
    if (password !== confirmPassword){
      setError("Passwords don't match.");
      return;
    }
    setError(null);
    setInfo(null);
    setLoading(true);
    const {error: signUpError, needsEmailConfirmation} = await signUp(
      email.trim(),
      password,
      name.trim(),
    );
    setLoading(false);

    if (signUpError){
      setError(signUpError);
      return;
    }
    if (needsEmailConfirmation){
      setInfo("Check your email to confirm your account, then login.");
      return;
    }
    router.replace("/(tabs)")
  }

  return (
    <View className="px-4 gap-4 mt-8">
      <Text className="text-[16px] font-bold text-center"
            style={{color: colors.textPrimary}}>
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
        keyboardType="email-address"
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
      {error && (
        <Text className="text-sm text-center" style={{color: colors.red}}>{error}</Text>
      )}
      {info && (
        <Text className="text-sm text-center" style={{color: colors.primary}}>{info}</Text>
      )}
     { loading ? (
        <ActivityIndicator size="small" color="#228B42"/>
     ) :
      (<PrimaryButton
        title="Sign Up"
        onPress={handleSignUp}
      />)}
      {/* <View className="flex-row items-center justify-center">
        <View className="flex-1 h-[1px] bg-gray-300" />
        <Text className="text-base text-gray-700 mx-4">or Continue with</Text>
        <View className="flex-1 h-[1px] bg-gray-300" />
      </View> */}
    </View>
  );
};
export default RegisterScreen;
