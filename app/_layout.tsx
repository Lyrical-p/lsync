import ThemeProvider from "@/src/Context/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import AuthProvider from "@/src/Context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <StatusBar />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ title: "Home" }} />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
