import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

const SplashScreen = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/AuthScreen");
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#2D9B52", "#228B42", "#1B5E3B"]}
      locations={[0, 0.45, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    >
      <LinearGradient
        colors={["rgba(123, 204, 22, 0.35)", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 0.8 }}
        style={StyleSheet.absoluteFill}
      />

      <View className="flex-1 items-center justify-center">
        <Image
          source={require("@/assets/images/bg_pattern2.png")}
          className="absolute bottom-0 pt-20 left-0 w-full opacity-20"
          resizeMode="contain"
        />
        <View className="w-30 h-20 rounded-full justify-center items-center  z-5">
          <Image
            source={require("@/assets/images/logo.png")}
            className="w-[400px] h-80"
          />
        </View>
        <Text className="mt-20 text-6xl font-bold text-[#FFFFFF]  letter-spacing-0.5">
          LSYNC
        </Text>
        <View className="my-5 w-10 h-0.5 rounded-2xl bg-[#84CC16]" />
        <Text className="text-white/85 text-base mb-16">
          Sync your semester. Own your time.
        </Text>
        <View className="absolute bottom-20 left-0 right-0 items-center z-10 gap-2.5">
          <ActivityIndicator
            size="large"
            color="#FFFFFF"
            className="p-20 mb-10"
          />
        </View>
      </View>
    </LinearGradient>
  );
};
export default SplashScreen;
