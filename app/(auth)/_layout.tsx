import { Stack } from "expo-router";
import React from "react";

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SplashScreen" />
      <Stack.Screen name="AuthScreen" />
    </Stack>
  );
};

export default AuthLayout;
