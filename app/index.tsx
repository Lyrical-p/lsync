import { useAuth } from "@/src/Context/AuthContext";
import { useTheme } from "@/src/Context/ThemeContext";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";


export default function Index() {
  const {session, initializing} = useAuth();
  const {colors} = useTheme()

  if (initializing) {
    return(
      <View className=" flex-1 items-center justify-center" style={{backgroundColor: colors.bg}}>
        <ActivityIndicator size="large" color={colors.primary}/>
      </View>
    )
  }
  return <Redirect href={session ? "/(tabs)" : "/(auth)/SplashScreen"} />;
}
