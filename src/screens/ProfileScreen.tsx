
import { useCallback, useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { api } from "../api/client";
import ScreenState from "../components/ScreenState";
import SettingRow from "../components/SettingRow";
import { useAsyncData } from "../hooks/useAsyncData";
import {  withOpacity } from "../Theme/colors";
import { useAuth } from "../Context/AuthContext";
import { router } from "expo-router";
import { useTheme } from "../Context/ThemeContext";
import ScreenHeader from "../components/ScreenHeader";
import { TAB_BAR_CLEARANCE } from "../Theme/layout";
import GlassCard from "../components/GlassCard";
import { typography } from "../Theme/typography";

import SectionLabel from "../components/SectionLabel";

const ProfileScreen = () => {
  const loader = useCallback(() => api.getProfile(), []);
  const { data, setData, loading, error, reload } = useAsyncData(loader);
  const {signOut} = useAuth();
  const {colors, isDark, setDarkMode} = useTheme()


  useEffect(() => {
    if (data && data.darkMode !== isDark){
      setDarkMode(data.darkMode)
    }
  }, [data, data?.darkMode, isDark, setDarkMode]);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/SplashScreen")
  }

  // const toggleNotification = async () => {
  //   if (!data) return;
  //   const next = !data.notifications;
  //   setData({ ...data, notifications: next });
  //   try {
  //     await api.updateProfileSettings({ notifications: next });
  //   } catch {
  //     setData({ ...data, notifications: !next });
  //   }
  // };

  const toggleDarkMode = async () => {
    if (!data) return;
    const next = !data.darkMode;
    setData({ ...data, darkMode: next });
    setDarkMode(next)
    try {
      await api.updateProfileSettings({ darkMode: next });
    } catch {
      setData({ ...data, darkMode: !next });
      setDarkMode(!next)
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg }}>
      <ScreenState loading={loading} error={error} onRetry={reload}>
        {data && (
          <>
            <ScreenHeader title="Profile"/>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{paddingHorizontal: 22, paddingBottom: TAB_BAR_CLEARANCE}}
              showsVerticalScrollIndicator={false}
            >

              <View className="gap-4">

                <GlassCard className="items-center gap-4 rounded-[22px] py-[22px]">
                  <View className="w-[72px] h-[72px] rounded-3xl items-center justify-center" style={{backgroundColor: colors.primary}}>
                    <Text className="text-2xl font-bold " style={{color: colors.white}}>{data.initials}</Text>
                  </View>
                  <View className="items-center gap-1">
                    <Text className={typography.profileName} style={{color: colors.textPrimary}}>{data.name}</Text>
                    <Text className="text-[13px] font-medium" style={{color: colors.textMuted}}>{data.email}</Text>
                  </View>
                  <View className="w-full flex-row items-center pt-3 border-t" style={{borderColor: colors.hairline}}>
                    <Stat value={data.streak} label="Day Streak"/>
                    <View className="w-px h-8" style={{backgroundColor: colors.hairline}}/>
                    <Stat value={`${data.onTimePercent}%`} label="On time"/>
                    <View className="w-px h-8" style={{backgroundColor: colors.hairline}}/>
                    <Stat value={data.taskDone} label="Tasks done"/>
                  </View>
                </GlassCard>


                
                <View className="gap-2.5">
                  <SectionLabel>Peferences</SectionLabel>   
                  <GlassCard rows>
                    <SettingRow
                      icon="bell-outline"
                      iconBg={withOpacity(colors.accent, 0.15)}
                      iconColor={colors.accent}
                      label="Notifications"
                      meta= "Deadline and session reminders"
                      type="chevron"
                      onPress={() => router.push("/notification-settings")}
                    />
                    <SettingRow
                      icon="moon-waning-crescent"
                      iconBg={withOpacity(colors.greenLight, 0.12)}
                      iconColor={colors.greenLight}
                      label="Dark Mode"
                      meta= {isDark ? "on" : "off"}
                      type="toggle"
                      value={data.darkMode}
                      onToggle={toggleDarkMode}
                    />
                    <SettingRow
                      icon="calendar-sync"
                      iconBg={withOpacity(colors.greenLight, 0.12)}
                      label="Google Calendar Sync"
                      meta = "Sync your classes and deadlines"
                      type="chevron"
                      iconColor={colors.greenLight}
                      last
                    />
                  </GlassCard>
                </View>

                <View className="gap-2.5">
                  <SectionLabel>Account</SectionLabel>   
                  <GlassCard rows>
                     <SettingRow
                    icon="shield-lock-outline"
                    iconBg={withOpacity(colors.orange, 0.12)}
                    iconColor={colors.orange}
                    label="Privacy & Security"
                    type="chevron"
                    onPress={()=> router.push("/privacy")}
                  />
                  <SettingRow
                    icon="logout"
                    iconBg={withOpacity(colors.redLight, 0.12)}
                    iconColor={colors.redLight}
                    label="Sign Out"
                    type="none"
                    onPress={handleSignOut}
                    last
                  />
                  </GlassCard>
                </View>
                
                
              </View>  
            </ScrollView>
          </>
        )}
      </ScreenState>
    </View>
  );
};
export default ProfileScreen;

const Stat =({value, label}: {value: string | number; label: string}) =>{
  const {colors} = useTheme()

  return (
    <View className="flex-1 items-center gap-1 pt-3">
      <Text className="text-[20px] font-extrabold tracking-tight" style={{color:colors.textPrimary}}>{value}</Text>
      <Text className="text-[11px] font-semibold" style={{color: colors.textMuted}}>{label}</Text>
    </View>
  )
}
