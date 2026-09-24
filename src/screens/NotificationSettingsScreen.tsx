import { useCallback, useState } from "react";
import { useTheme } from "../Context/ThemeContext"
import { api } from "../api/client";
import { useAsyncData } from "../hooks/useAsyncData";
import { cancelDailyHabitReminder, cancelDailyScheduleDigest, ensureAndroidChannel, requestNotificationPermission, scheduleDailyHabitReminder, scheduleDailyScheduleDigest, setClassRemindersEnabled, setTaskRemindersEnabled } from "../lib/notification";
import { Alert, ScrollView, Text } from "react-native";
import ScreenState from "../components/ScreenState";
import SettingRow from "../components/SettingRow";
import { withOpacity } from "../Theme/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";





const NotificationSettingsScreen = () => {
    const {colors} = useTheme();
    const loader = useCallback(() => api.getProfile(), []);
    const {data, setData, loading, error, reload} = useAsyncData(loader);
    const [saving, setSaving] = useState(false)
    const inset = useSafeAreaInsets()

    const ensurePermission = async (): Promise<boolean> => {
        const granted = await requestNotificationPermission();
        if (!granted){
            Alert.alert(
                "Permission needed",
                "Enable notifications for lsync in your device settings to turn this on."
            );
            return false;
        }
        await ensureAndroidChannel();
        return true;
    }

    const persist = async (patch: Partial<{
        notifyTasks: boolean;
        notifyClasses: boolean;
        notifyHabits: boolean;
        notifySchedule: boolean;
    }>) => {
        if (!data) return;
        const prevData = data;
        setData({...data, ...patch});
        setSaving(true);
        try{
            await api.updateProfileSettings(patch);
        }catch{
            setData(prevData);
        }finally{
            setSaving(false)
        }
    };

    const toggleTasks = async () => {
        if (!data) return;
        const next = !data.notifyTasks;
        if (next && !(await ensurePermission())) return;
        await setTaskRemindersEnabled(next);
        await persist ({notifyTasks: next})
    }

    const toggleClasses = async () => {
        if (!data) return;
        const next = !data.notifyClasses;
        if (next && !(await ensurePermission())) return;
        await setClassRemindersEnabled(next);
        await persist ({notifyClasses: next})
    }

    const toggleHabits = async () =>{
        if (!data) return;
        const next = !data.notifyHabits;
        if (next) {
            if (!(await ensurePermission())) return;
            await scheduleDailyHabitReminder(9,0);
        }else {
            await cancelDailyHabitReminder();
        }
        await persist({notifyHabits: next})
    }

    const toggleSchedule = async () =>{
        if (!data) return;
        const next = !data.notifySchedule;
        if (next) {
            if (!(await ensurePermission())) return;
            await scheduleDailyScheduleDigest(7,30);
        }else {
            await cancelDailyScheduleDigest();
        }
        await persist({notifySchedule: next})
    }

    return(
        <ScreenState loading={loading} error={error} onRetry={reload}>
            {data &&(
                <ScrollView className="flex-1" style={{backgroundColor: colors.bg}}
                   contentContainerStyle={{paddingHorizontal: 20, paddingBottom:40, gap: 24, paddingTop: inset.top + 40}}>
                    <Text className="text-[13.5px] font-black px-1 mb-2" style={{color: colors.textSecondary}}>
                        REMINDERS
                    </Text>
                    {saving &&(
                        <Text className="text-[11px] px-1 mb-2" style={{color: colors.textMuted}}>
                            Saving...
                        </Text>
                    )}
                    <SettingRow
                      icon="checkbox-marked-circle-outline"
                      iconBg={withOpacity(colors.accent, 0.15)}
                      iconColor={colors.accent}
                      label="Task Deadlines"
                      type="toggle"
                      value={data.notifyTasks}
                      onToggle={toggleTasks} />
                    <SettingRow
                      icon="calendar-clock"
                      iconBg={withOpacity(colors.greenLight, 0.12)}
                      iconColor={colors.greenLight}
                      label="Class Reminders"
                      type="toggle"
                      value={data.notifyClasses}
                      onToggle={toggleClasses} />
                    <SettingRow
                      icon="repeat"
                      iconBg={withOpacity(colors.orange, 0.12)}
                      iconColor={colors.orange}
                      label="Habit Reminders"
                      type="toggle"
                      value={data.notifyHabits}
                      onToggle={toggleHabits} />
                    <SettingRow
                      icon="clipboard-text-clock-outline"
                      iconBg={withOpacity(colors.redLight, 0.12)}
                      iconColor={colors.redLight}
                      label="Daily Schedule Digest"
                      type="toggle"
                      value={data.notifySchedule}
                      onToggle={toggleSchedule} />
                </ScrollView>
            )}

        </ScreenState>
    )

}


export default NotificationSettingsScreen