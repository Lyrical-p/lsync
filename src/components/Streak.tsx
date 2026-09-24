import { Text, View } from "react-native";

import { StreakDay } from "../types";
import { useTheme } from "../Context/ThemeContext";

interface StreakProps {
  days: { label: string; letter: string; state: StreakDay }[];
}

const Streak = ({ days }: StreakProps) => {
  const {colors} = useTheme()
  return (
    <View className="flex-row gap-1.5">
      {days.map((day) => {
        const today = day.state === "today"
        return(
          <View key={day.label} className="flex-1 items-center gap-1.5 rounded-[14px] py-2.5"
            style={{backgroundColor: today ? colors.ink : "transparent"}}>

            <Text className="text-[10px] font-semibold" style={{color: today 
              ? colors.onInk : colors.textMuted}}>
            {day.label}</Text>

            <Text className="text-[15px] font-bold" style={{color: today 
              ? colors.onInk : colors.textBody}}>
            {day.letter}</Text>

            <View className="w-1 h-1 rounded-full" style={{backgroundColor: day.state === "done" 
              ? (today ? colors.onInk : colors.primary) : "transparent"}}/>
          </View>
        )
      
      })}
    </View>
  );
};
export default Streak;
