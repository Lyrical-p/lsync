import { Text, View } from "react-native";
import { useTheme } from "../Context/ThemeContext";

interface BarChartProps {
  bars: { height: number; label: string }[];
  figHeight?:number
}

const BarChart = ({ bars,figHeight = 80 }: BarChartProps) => {
  const {colors} = useTheme()
  const apex = Math.max(...bars.map((b) => b.height))

  if(!bars.length || apex<= 0) {
    return(
      <View className="mt-4 items-center justify-center rounded-2xl gap-2"
        style={{height: figHeight + 22, backgroundColor: colors.progressBg}}>
        <Text className="text-[13px] font-semibold" style={{color:colors.textMuted}}>
          No sessions logged this week yet.
        </Text> 
        <Text className="text-[11.5px] font-medium" style={{color:colors.placeholder}}>
          Your daily hours appear here.
        </Text> 
      </View>
    )
  }


  return (
    <View className="flex-row items-end gap-2 mt-4" style={{height: figHeight + 22}}>
      {bars.map((bar) => {
        const isApex = bar.height === apex
        return(
          <View key={bar.label} className="flex-1 items-center justify-end gap-2 h-full">
            <View className="w-full rounded-[7px]"
              style={{
                height: Math.max(6, (bar.height / apex)*figHeight),
                backgroundColor: isApex ? colors.primary : colors.accentLight,
                opacity: isApex ? 1:0.45
            }}/>
            <Text className={isApex ? "text-[10.5px] font-bold" : "text-[10.5px] font-semibold"}
              style={{color: isApex ? colors.textPrimary : colors.textMuted}}
            >{bar.label}</Text>            
          </View>
        )
      })}                
    </View>
  );
};
export default BarChart;
