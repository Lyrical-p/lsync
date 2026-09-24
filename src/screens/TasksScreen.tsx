import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
// import { } from "react-native-reanimated/lib/typescript/Animated";
import { api, PomodoroData } from "../api/client";
import GlassCard, { cardShad } from "../components/GlassCard";
import PomodoroRing from "../components/PomodoroRing";
import ScreenHeader from "../components/ScreenHeader";
import ScreenState from "../components/ScreenState";
import StatCard from "../components/StatCard";
import TaskItem from "../components/TaskItem";

import { HabitData, TaskData } from "../types";

import { useTheme } from "../Context/ThemeContext";
import { TAB_BAR_CLEARANCE } from "../Theme/layout";
import SectionLabel from "../components/SectionLabel";
import { typography } from "../Theme/typography";
import { notifyPomodoroComplete, scheduleTaskReminders } from "../lib/notification";
import AddTask from "../components/AddTask";

type SubTab = "tasks" | "pomo" | "habits";
const sub_tabs: {key: SubTab; label:string}[] = [
  {key: "tasks", label: "Tasks"},
  {key: "pomo", label: "Pomodoro"},
  {key: "habits", label: "Habits"},

]

const scroll = {paddingHorizontal: 22, paddingBottom: TAB_BAR_CLEARANCE}

const TasksScreen = () => {
  const {colors, subjectColors} = useTheme()
  const [subTab, setSubTab] = useState<SubTab>("tasks");
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [upcoming, setUpcoming] = useState<TaskData[]>([]);
  const [habitList, setHabitList] = useState<HabitData[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroMeta, setPomodoroMeta] = useState<PomodoroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addTasks, setAddTasks] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [todayTasks, upcomingTasksData, habitsData, pomodoro] =
        await Promise.all([
          api.getTasks("today"),
          api.getTasks("upcoming"),
          api.getHabits(),
          api.getPomodoro(),
        ]);
      setTasks(todayTasks);
      setUpcoming(upcomingTasksData);
      setHabitList(habitsData);
      setSecondsLeft(pomodoro.secondsLeft);
      setIsRunning(pomodoro.isRunning);
      setPomodoroMeta(pomodoro);
      scheduleTaskReminders([...todayTasks, ...upcomingTasksData]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  useEffect(() => {
    const sync = setInterval(async () => {
      try {
       const updated = await api.updatePomodoro({ secondsLeft, isRunning });
       if (isRunning && !updated.isRunning){
        notifyPomodoroComplete();
       }
       setSecondsLeft(updated.secondsLeft);
       setIsRunning(updated.isRunning);
       setPomodoroMeta(updated)
      } catch {}
    }, 5000);
    return () => clearInterval(sync);
  }, [secondsLeft, isRunning]);

  const toggleTask = async (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
    try {
      const updated = await api.toggleTask(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      scheduleTaskReminders([updated])
    } catch {
      loadData();
    }
  };

  const deleteTask = (id: string, title: string) =>{
      Alert.alert(
        "Delete task",
        `Remove "${title}". This can't be undone.`,[
          {text:"Cancel", style:"cancel"},
          {text: "Delete", style: "destructive",
            onPress: async () => {
              try{
                await api.deleteTask(id);
                loadData();
              }catch(err){
                Alert.alert(
                  "Couldn't delete", err instanceof Error ? err.message : "Something went wrong."
                )
              }
            }
          }
        ]
      )
    }

  const toggleHabit = async (id: string) => {
    setHabitList((prev) =>
      prev.map((h) => (h.id === id ? { ...h, doneToday: !h.doneToday } : h)),
    );
    try {
      const updated = await api.toggleHabit(id);
      setHabitList((prev) => prev.map((h) => (h.id === id ? updated : h)));
    } catch {
      loadData();
    }
  };

  const resetPomodoro = async () => {
    try {
      const updated = await api.updatePomodoro({ reset: true });
      setSecondsLeft(updated.secondsLeft);
      setIsRunning(updated.isRunning);
      setPomodoroMeta(updated);
    } catch {
      loadData();
    }
  };

  const togglePomodoro = async () => {
    const nextRunning = !isRunning;
    setIsRunning(nextRunning);
    try {
      await api.updatePomodoro({ secondsLeft, isRunning: nextRunning });
    } catch {
      loadData();
    }
  };

  const doneCount = tasks.filter((t) => t.done).length;
  const remaining = tasks.length - doneCount

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg }}>
      <ScreenHeader title={subTab === "pomo" ? "Focus" : subTab === "habits" ? "Habits" : "Tasks"}
      subtitle={subTab === "pomo" ? pomodoroMeta?.focusLabel : subTab === "habits" ? `${habitList.filter((h) => h.doneToday).length} of ${habitList.length} done today`
      : `${doneCount} of ${tasks.length} done today`}
      action=" New" 
      onAction={() => setAddTasks(true)}/>

      <View className="mx-[22px] mb-4 flex-row rounded-2xl p-1 " style={{backgroundColor: colors.fill}}>
       {sub_tabs.map((tab) => {
        const on = subTab === tab.key
        return(
          <Pressable key={tab.key} onPress={() => setSubTab(tab.key)} 
            className="flex-1 h-9 items-center justify-center rounded-xl"
            style={on ? [{backgroundColor: colors.surface}, cardShad] : undefined}>
            
            <Text className={on ? "text-[13.5px] font-bold " : "text-[13.5px] font-semibold "}
              style={{color: on ? colors.textPrimary : colors.textSecondary}}>
              {tab.label}</Text>
          </Pressable>
        )
      })}
      </View>

      <ScreenState loading={loading} error={error} onRetry={loadData}>
        {pomodoroMeta && (
          <>
            {subTab === "tasks" && (
              <ScrollView
                className="flex-1"
                contentContainerStyle={scroll}
                showsVerticalScrollIndicator={false}
              >
                <View className="gap-4">
                  {tasks.length > 0 && (
                    <View className="gap-2.5">
                      <SectionLabel right={
                          <Text className="text-xs font-semibold" style={{color: colors.placeholder}}>
                            {remaining} remaning
                          </Text>
                      }>
                        Today                        
                      </SectionLabel>
                      <GlassCard rows>
                        {tasks.map((t, i) => (
                          <TaskItem
                            key={t.id}
                            task={t}
                            onToggle={() => toggleTask(t.id)} 
                            onDelete={() => deleteTask(t.id, t.title)}
                            last ={i === tasks.length - 1 }
                          />
                        ))}
                      </GlassCard>
                    </View>
                  )}
                  {upcoming.length > 0 && (
                    <View className="gap-2.5">
                      <SectionLabel>  Upcoming  </SectionLabel>
                      <GlassCard rows>
                        {upcoming.map((t, i) => (
                          <TaskItem key={t.id} task={t} 
                            last={i === upcoming.length - 1} 
                            onDelete={() => deleteTask(t.id, t.title) }/>
                        ))}
                      </GlassCard>
                    </View> 
                  )}
                </View>
              </ScrollView>
            )}

            {subTab === "pomo" && (
              <ScrollView
                className="flex-1"
                contentContainerStyle={scroll}
                showsVerticalScrollIndicator={false}
              >
                <View className="gap-4">
                  <GlassCard className="items-center gap-5 rounded -[26px]"> 
                    <PomodoroRing secondsLeft={secondsLeft} isRunning={isRunning}/>
                    <View className="flex-row gap-2.5 w-full">
                      <Pressable
                        className="w-14 h-[54px] items-center justify-center rounded-2xl active:opacity-70 "
                        style={[{backgroundColor: colors.surface}, cardShad]}
                        onPress={resetPomodoro}
                      >
                        <MaterialCommunityIcons name="refresh" size={19} color={colors.textBody}/>
                      </Pressable>
                      <Pressable
                        className="flex-1 flex-row h-[54px] items-center justify-center rounded-2xl active:opacity-80 "
                        style={{backgroundColor: colors.primary}}
                        onPress={togglePomodoro}
                      >
                        <MaterialCommunityIcons name={isRunning ? "pause" : "play"} size={18} color={colors.white}/>
                        <Text className="text-[15px] font-bold" style={{color: colors.white}}>
                          {isRunning ? "pause" : secondsLeft >= 1500 ? "Start session " : "Resume"}
                        </Text>
                      </Pressable>
                    </View>
                  </GlassCard>

                  <View className="gap-2.5" >
                    <SectionLabel>Session length</SectionLabel>
                    <View className="flex-row gap-2.5">
                      {[
                        {minutes: 25, label: "Focus"},
                        {minutes: 5, label: "Short"},
                        {minutes: 15, label: "Long"},
                      ].map((mode) => {
                        const on = Math.round(secondsLeft / 60) === mode.minutes 
                        || (mode.minutes === 25 && secondsLeft > 900)
                        return(
                          <Pressable key={mode.label} onPress={() => {setIsRunning(false); 
                            setSecondsLeft(mode.minutes*60)}}
                            className="flex-1 items-center gap-0.5 rounded-2xl px-2.5, py-3 active:opacity-80"
                            style={on ? {backgroundColor: colors.primary } : [{backgroundColor: colors.surface}, cardShad]}>
                            
                            <Text className="text=[17px] font-extrabold tracking-tight " style={{color: on ? colors.white : colors.textPrimary}}>{mode.minutes}</Text>
                            <Text className="text=[11px] font-semibold " style={{color: on ? "rgba(255,255,255,0.8)" : colors.textMuted}}>{mode.label}</Text>
                          </Pressable>
                        )
                      })}
                    </View>
                  </View>

                  <View className="gap-2.5">
                    <SectionLabel>Today</SectionLabel>
                    <View className="flex-row gap-2.5">
                      <StatCard
                        value={pomodoroMeta.sessionCount}
                        label="Sessions"
                        className="flex-1"
                      />
                      <StatCard
                        value={pomodoroMeta.focusedTime}
                        label="Focused"
                        className="flex-1 "
                      />
                      <StatCard
                        value={pomodoroMeta.breakCount}
                        label="Breaks"                       
                        className="flex-1"
                      />
                    </View>
                  </View>
                </View>
              </ScrollView>
            )}

            {subTab === "habits" && (
              <ScrollView
                className="flex-1"
                contentContainerStyle={scroll}
                showsVerticalScrollIndicator={false}
              >
                <View className="gap-2.5">
                  <SectionLabel>This Week</SectionLabel>
                  {habitList.map((habit) => (
                    <GlassCard key={habit.id} className="gap-3.5">
                      <View className="flex-row items-center justify-between gab-3">
                        <View className="flex-1 gap-0.5">
                          <Text className={typography.className}
                                style={{color: colors.textPrimary}}>
                            {habit.name}
                          </Text>
                          <Text
                            className={typography.taskMeta}
                            style={{ color: colors.textMuted }}
                          >
                            {habit.description}
                          </Text>
                        </View>
                        <Pressable
                          className="w-8 h-8 rounded-[10px] items-center justify-center active:opacity-70"
                          style={habit.doneToday ? { backgroundColor:  colors.primary }: {borderWidth: 1.6, borderColor: colors.placeholder}}
                          onPress={() => toggleHabit(habit.id)}
                        >
                          {habit.doneToday && (
                            <MaterialCommunityIcons
                              name="check"
                              size={16}
                              color={colors.white}
                            />
                          )}
                        </Pressable>
                      </View>
                      <View className="flex-row gap-1.5">
                        {habit.week.map((done, index) => (
                          <View
                            key={index}
                            className="flex-1 h-[30px] rounded-[8px] "
                            style={{
                              backgroundColor: done
                                ? subjectColors[habit.colorKey].bg
                                : colors.fill, opacity: done ? 1:0.7
                            }}
                          />
                        ))}
                      </View>
                    </GlassCard>
                  ))}
                </View>  
              </ScrollView>
            )}
          </>
        )}
      </ScreenState>
      <AddTask
        visible={addTasks}
        onClose={() => setAddTasks(false)}
        onCreated={() => {
          setAddTasks(false);
          loadData();
        }}/>
    </View>
  );
};
export default TasksScreen;


