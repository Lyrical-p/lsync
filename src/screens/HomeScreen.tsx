
import { useCallback, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { api } from "../api/client";
import ClassItem from "../components/ClassItem";
import GlassCard, { cardShad } from "../components/GlassCard";
import ProgressBar from "../components/ProgressBar";
import QuoteCard from "../components/QuoteCard";
import { QuickActionButton } from "../components/ScreenHeader";
import ScreenState from "../components/ScreenState";
import Streak from "../components/Streak";
import { useAsyncData } from "../hooks/useAsyncData";

import { useTheme } from "../Context/ThemeContext";
import {router} from "expo-router";
import { HEADER, TAB_BAR_CLEARANCE } from "../Theme/layout";
import { typography } from "../Theme/typography";
import SectionLabel from "../components/SectionLabel";
import TaskItem from "../components/TaskItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const HomeScreen = () => {
  const load = useCallback(() => api.getHome(), []);
  const { data, loading, error, reload } = useAsyncData(load);
  const {colors} = useTheme()

  const[gaolModal, setGoalModal] = useState(false)
  const[gaolInput, setGoalInput] =useState("")
  const [goalErr, setGoalErr] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const openGoalMod = () =>{
    setGoalInput(String(data?.dailyGoal.target ?? 5))
    setGoalErr(null)
    setGoalModal(true)
  };

  const handleGoal = async () => {
    const parsed = parseInt(gaolInput, 10);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 50){
      setGoalErr("Enter a whole number between 1 and 50");
      return;
    }
    setGoalErr(null);
    setSaving(true)
    try{
      await api.updateDailyGoal(parsed)
      setGoalModal(false)
      reload()
    } catch (err) {
      setGoalErr(err instanceof Error ? err.message : "Couldn't update goal")
    }finally{
      setSaving(false)
    } 
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg }}>
      <ScreenState loading={loading} error={error} onRetry={reload}>
        {data && (
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false} 
            contentContainerStyle={{paddingTop: HEADER, paddingHorizontal: 22, paddingBottom: TAB_BAR_CLEARANCE}}>

            <View className="gap-5">
              <View className="flex-row items-center gap-3">

                <View className="w-11 h-11 rounded-[14px] items-center justify-center" style={{backgroundColor: colors.primary}}>
                  <Text className="text-[15px] font-bold" style={{color:colors.white}}>{data.user.initials}</Text>
                </View>

                <View className="flex-1 gap-0.5">
                  <Text className={typography.greeting} style={{color:colors.textMuted}}>
                    {data.user.greeting}
                  </Text>

                  <Text className={typography.username} style={{color: colors.textPrimary}}>
                    {data.user.name}
                  </Text>
                </View>

                <Pressable onPress={() => router.push("/Profile")} className="w-[38px] h-[38px] rounded-xl items-center justify-center active:opacity-70"
                  style={[{backgroundColor: colors.surface}, cardShad]}>
                  <Text className="text-base" style={{color: colors.textBody}}>
                    <MaterialCommunityIcons name="cog-outline" size={19} color={colors.textBody}/>
                  </Text>
                </Pressable>
              </View>

              <View className="flex-row gap-2">
                <View className="rounded-full px-3 py-2 flex-row items-center gap-2" style={{backgroundColor: colors.streakToday}}>
                  <View className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: colors.primary}}/>
                  <Text className="text-[12.5px] font-bold" style={{color: colors.accent}}>
                    {data.user.streak}-day streak
                  </Text>
                </View>
                <View className="rounded-full px-3 py-2" style={[{backgroundColor: colors.surface}, cardShad]} >
                  <Text className="text-[12.5px] font-semibold" style={{color: colors.textBody}} >
                    {data.user.semester}
                  </Text>
                </View>
              </View>

              
              <Streak days={data.streakDays} />

              <GlassCard className="gap-3.5">
                <SectionLabel right={
                <View className="flex-row items-center gap-2">
                  <Text className="text-[12.5px] font-semibold" style={{color: colors.textBody}}>
                  {Math.max(0, data.dailyGoal.target - data.dailyGoal.current)} left
                 </Text>
                 <Pressable onPress={openGoalMod} hitSlop={8}>
                    <MaterialCommunityIcons name="pencil-outline" size={15} color={colors.textMuted}/>
                 </Pressable>
                </View>
                }>
                  Today&apos;s goal
                </SectionLabel>
                <View className="flex-row items-end gap-2">
                  <Text className={typography.bigValue} style={{color: colors.textPrimary}}>{data.dailyGoal.current}</Text>
                  <Text className="text-[15px] font-semibold pb-1" style={{color: colors.textMuted}}> / {data.dailyGoal.target} tasks done</Text>
                </View>
                <ProgressBar percent={data.dailyGoal.percent}/>
                {!!data.dailyGoal.hint && (
                  <Text className="text-xs font-medium" style={{color: colors.placeholder}}>{data.dailyGoal.hint}</Text>
                )}
              </GlassCard>

              <View className="flex-row gap-2.5">
                <QuickActionButton primary icon="plus" label="Add Task" onPress={() => router.push("/Tasks")} />
                <QuickActionButton icon="timer-outline"  label="Start focus"  onPress={() => router.push("/Tasks")}/>
              </View>
              
              {data.classes.length > 0 &&(
                <View className="gap-2.5">
                  <SectionLabel right={
                    <Pressable onPress={() => router.push("/Schedule")}>
                      <Text className="text-[12.5px] font-bold" style={{color: colors.accent}}>Schedule</Text>
                    </Pressable>
                  }>
                    Today&apos;s classes
                  </SectionLabel>
                  <GlassCard rows>
                    {data.classes.map((c, i)=>(
                      <ClassItem key={c.id} item={c} last={i === data.classes.length -1}/>
                    ))}
                  </GlassCard>
                </View>
              )}

              {data.deadlines.length > 0 && (
                <View className="gap-2.5">
                  <SectionLabel>
                    {data.deadlines.length > 1 ? "upcoming deadlines" : "Next deadline"}
                  </SectionLabel>
                  <GlassCard rows>
                    {data.deadlines.slice(0, 3).map((t, i, arr) => (
                      <TaskItem key={t.id} task={t} last={i === arr.length - 1}/>
                    ))}
                  </GlassCard>
                </View>
              )}
                
              {!!data.quote?.text && <QuoteCard text={data.quote.text} author={data.quote.author}/>}
            </View>
          </ScrollView>
        )}
      </ScreenState>
      <Modal visible={gaolModal} animationType="fade" transparent onRequestClose={() => setGoalModal(false)}>
         <View className="flex-1 items-center justify-center px-8" style={{backgroundColor: "rgba(0,0,0,0.4)"}}>
          <View className="w-full rounded-2xl p-5 gap-3.5" style={{backgroundColor: colors.surface}}>
            <Text className="text-base font-bold text-center" style={{color: colors.textPrimary}}>
              Set daily task goal
            </Text>
            <TextInput
              value={gaolInput}
              onChangeText={setGoalInput}
              keyboardType="number-pad"
              placeholder="e.g. 5"
              placeholderTextColor={colors.placeholder}
              className="rounded-xl px-4 py-3 text-[15px] border text-center"
              style={{borderColor: colors.border, color: colors.textPrimary}}
            />
            {goalErr && (
              <Text className="text-sm text-center" style={{color: colors.red}}>{goalErr}</Text>
            )}
            <View className="flex-row gap-3 mt-1">
              <Pressable onPress={() => setGoalModal(false)}
                className="flex-1 items-center py-3 rounded-full border"
                style={{borderColor: colors.border}}>
                <Text className="font-semibold" style={{color: colors.textSecondary}}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleGoal} disabled={saving}
                className="flex-1 items-center py-3 rounded-full"
                style={{backgroundColor: colors.primary, opacity: saving ? 0.6 : 1}}>
                <Text className="font-semibold" style={{color: colors.white}}>
                  {saving ? "Saving..." : "Save"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default HomeScreen;
