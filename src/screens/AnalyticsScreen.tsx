
import React, { useCallback } from "react";
import { ScrollView, Text, View } from "react-native";
import { api } from "../api/client";
import BarChart from "../components/BarChart";
import GlassCard from "../components/GlassCard";
import ProgressBar from "../components/ProgressBar";
import ScreenHeader from "../components/ScreenHeader";
import ScreenState from "../components/ScreenState";
import StatCard from "../components/StatCard";
import { useAsyncData } from "../hooks/useAsyncData";

import { useTheme } from "../Context/ThemeContext";
import { TAB_BAR_CLEARANCE } from "../Theme/layout";
import SectionLabel from "../components/SectionLabel";
import InsightCard from "../components/InsightCard";

const AnalyticsScreen = () => {
  const {colors} = useTheme()
  const loader = useCallback(() => api.getAnalytics(), []);
  const { data, loading, error, reload } = useAsyncData(loader);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg }}>
      <ScreenHeader title="Analytics" actionSubtitle="This week" />

      <ScreenState loading={loading} error={error} onRetry={reload}>
        {data && (
          <ScrollView
            className="flex-1 "
            contentContainerStyle={{paddingHorizontal: 22, paddingBottom: TAB_BAR_CLEARANCE }}
            showsVerticalScrollIndicator={false}
          >
            <View className="gap-4">
              <View className="flex-row flex-wrap gap-2.5">
                {data.stats.map((s, i) => (
                  <StatCard
                    key={s.label}
                    value={s.value}
                    label={s.label}
                    highlight={i===0}
                    className="flex-grow basis-[47%]"
                  />
                ))}
              </View>

              <GlassCard>
                <SectionLabel right={
                  <Text className="text-xs font-semibold" style={{ color: colors.textBody }}>
                  {data.weeklyBars.length} days
                  </Text>
                }>
                  Hours per day
                </SectionLabel>
                <BarChart bars={data.weeklyBars} />
              </GlassCard>

              <GlassCard className="gap-4">
                <SectionLabel>By subject</SectionLabel>
                {data.subjectBreakDowns.length > 0 ?(
                  data.subjectBreakDowns.map((s) => (
                    <View key={s.name} className="gap-1.5">
                      <View className="flex-row justify-between">
                        <Text className="text-[13px] font-bold" style={{color: colors.textPrimary}}>
                          {s.name}
                        </Text>
                        <Text className="text-[13px] font-bold" style={{color: colors.textBody}}>{s.percent}%</Text>
                      </View> 
                      <ProgressBar percent={s.percent} color={s.color} height={7}/>                   
                    </View>
                  ))
                ):(
                  <Text className="text-[13px] font-medium" style={{color:colors.textMuted}}>log on Pomodoro session and 
                  your subject split appears here.</Text>
                )}
              </GlassCard>

              {!!data.insight && <InsightCard title="This week's pattern" text={data.insight}/>}

              {/* <GlassCard>
                <Text
                  className="text-[11px] font-medium letter-spacing-[0.5px], uppercase mb-0"
                  style={{ color: colors.textSecondary }}
                >
                  AI Insights
                </Text>
                <View className="flex-row gap-[10px] mt-2">
                  <View className="w-8 h-8 rounded-[10px] items-center justify-center "
                        style={{backgroundColor: colors.streakToday}}>
                    <MaterialCommunityIcons
                      name="brain"
                      size={16}
                      color={colors.accent}
                    />
                  </View>
                  
                    <Text className="flex-1 text-xs leading-[29px]" style={{ color: colors.textSecondary }}>
                    
                    
                    {data.insight}
                  </Text>
                </View>
              </GlassCard> */}
            </View>
          </ScrollView>
        )}
      </ScreenState>
    </View>
  );
};
export default AnalyticsScreen;
