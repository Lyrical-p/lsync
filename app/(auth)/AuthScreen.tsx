import LoginScreen from "@/src/components/screens/LoginScreen";
import RegisterScreen from "@/src/components/screens/RegisterScreen";
import { LinearGradient } from "expo-linear-gradient";
import Lottie from "lottie-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AuthScreen = () => {
  const [activeTab, setActiveTab] = useState("login");
  const isLogin = activeTab === "login";
  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#2ED398", "#72E0C4", "#56BCD0", "#2A82C6", "#0E4EA3"]}
        locations={[0, 0.28, 0.55, 0.8, 1]}
        start={{ x: 0.05, y: 0.15 }}
        end={{ x: 0.95, y: 0.95 }}
        style={{
          flex: 1,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
        }}
      />
      <View className="flex-[4] items-center justify-center">
        <Lottie
          source={require("@/assets/animations/Blogging.json")}
          autoPlay
          loop
          resizeMode="contain"
          style={{ width: "90%", height: "90%" }}
        />
      </View>
      <View className="flex-[6] bg-white px-4 rounded-t-[40px]">
        <KeyboardAvoidingView
          behavior={"padding"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            {isLogin ? <LoginScreen /> : <RegisterScreen />}
            <View className="flex-row items-center justify-center gap-2 mt-4">
              <Text>
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </Text>
              <TouchableOpacity
                onPress={() => setActiveTab(isLogin ? "signup" : "login")}
              >
                <Text className="text-green-500">
                  {isLogin ? "Sign Up" : "Login"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};
export default AuthScreen;
