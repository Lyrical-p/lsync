import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { api } from "../api/client";
import ChipSelector from "../components/ChipSelector";
import ScreenHeader from "../components/ScreenHeader";
import ScreenState from "../components/ScreenState";
import { useAsyncData } from "../hooks/useAsyncData";

import { useTheme } from "../Context/ThemeContext";
import { TAB_BAR_CLEARANCE } from "../Theme/layout";
import GlassCard from "../components/GlassCard";
import ClassModal from "../components/ClassModal";

const rowHeight = 60
const gutter = 48

const ScheduleScreen = () => {

  const [selectedDay, setSelectedDay] = useState("Mon");
  const loader = useCallback(() => api.getSchedule(selectedDay), [selectedDay]);
  const { data, loading, error, reload } = useAsyncData(loader);

  const {colors, subjectColors} = useTheme()
  const [addClass, setAddClass] = useState(false)
  const [cateFilter, setCateFilter] = useState<"All" | "Personal" | "School">("All")

  const visible = (category: "personal" | "school") => 
    cateFilter === "All" || category === cateFilter.toLowerCase();

  const visibleSlotAtHour = data?.slotAtHour.map((idx) => {
    if(idx === null) return null;
    const slot = data.slots[idx]
    return slot && visible(slot.category) ? idx : null
  }) ?? []

  const nextSlot = visibleSlotAtHour.findIndex((s) => s !== null)

  const deleteClass = (id: string, name: string) =>{
    Alert.alert(
      "Delete class",
      `Remove "${name}" from your schedule. This can't be undone.`,[
        {text:"Cancel", style:"cancel"},
        {text: "Delete", style: "destructive",
          onPress: async () => {
            try{
              await api.deleteClass(id);
              reload();
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

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg }}>
      <ScreenHeader title="Schedule" subtitle={selectedDay} action="Class" onAction={() => setAddClass(true)}/>

      {data && <ChipSelector options={data.weekDays} selected={selectedDay} onSelect={setSelectedDay}/>}
      <ChipSelector options={["All", "Personal", "School"]}
        selected={cateFilter}
        onSelect={(v)=> setCateFilter(v as "All" | "Personal" | "School")} />


      <ScreenState loading={loading} error={error} onRetry={reload}>
        {data && (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{paddingHorizontal: 22, paddingBottom: TAB_BAR_CLEARANCE}}
            showsVerticalScrollIndicator={false}
          >
            <View className="gap-4">
              {nextSlot >= 0 && visibleSlotAtHour[nextSlot] !== null &&(
                <View className="flex-row items-center gap-2.5 rounded-2xl px-4 py-3" style={{backgroundColor: colors.streakToday}}>
                  <View className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: colors.primary}}/>
                  <Text className="text[13px] font-bold" style={{color: colors.accent}}>
                    Up next.{data.slots[visibleSlotAtHour[nextSlot] as number].name} at {data.timetableHours[nextSlot]}
                  </Text>
                </View>
              )}

              <GlassCard className="px-4 pt-3.5 pb-2">
                {data.timetableHours.map((hour, index) => {
                  const slotIdx = visibleSlotAtHour[index];
                  const slot = slotIdx !== null ? data.slots?.[slotIdx] : null;
                  const sc = slot ? subjectColors?.[slot.colorKey] : null;
                  const filled = slot && sc

                  return (
                    <View key={hour} className="flex-row gap-3" style={{height: rowHeight}}>
                      <Text className="text-[11px] font-bold pt-0.5" style={{ width: gutter, color: colors.placeholder}}>{hour}</Text>
                      
                      <View className="flex-1 border-t"  style={{ borderColor: colors.hairline}} >
                        {filled && (
                          <Pressable onLongPress={()=>
                            slot!.classId && deleteClass(slot!.classId, slot!.name)
                            }
                            className="rounded-xl px-3 py-2.5 gap-0.5 mt-1" 
                            style={{backgroundColor: sc!.bg, height: rowHeight-12, 
                            borderLeftWidth: slot!.colorKey === "green" ? 0 :3,
                            borderLeftColor: sc!.border}}>

                            <Text className="text-[13px] font-bold" numberOfLines={1} style={{ color: sc!.text }}>
                              {slot!.name}
                            </Text>
                            <Text className="text-[11.5px] mt-0.5" numberOfLines={1} style={{ color: sc!.sub }}>
                              {slot!.detail}
                            </Text>
                          </Pressable>
                        )}
                      </View>
                      
                    </View>
                  );
                })}
              </GlassCard>
            </View>
          </ScrollView>
        )}
      </ScreenState>
      <ClassModal visible={addClass} onClose={() => setAddClass(false)}
        onCreated={() => {
          setAddClass(false)
          reload()
        }}
        />
    </View>
  );
};
export default ScheduleScreen;


