
import { DimensionValue, View } from "react-native";
import { useTheme } from "../Context/ThemeContext";

interface ProgressBarProps {
  percent: number;
  color?: string;
  height?: number;
}

const ProgressBar = ({ percent, color, height = 8 }: ProgressBarProps) => {
  const {colors} = useTheme()
  const width = `${Math.max(0, Math.min(100, percent))}%` as DimensionValue
  return (
    <View className="rounded-full overflow-hidden" style={{height, backgroundColor: colors.progressBg}}>
      <View className="rounded-full" style={{width, height, backgroundColor: color ?? colors.primary}}/>
    </View>
  );
};
export default ProgressBar;
