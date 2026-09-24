import { Text, View, ViewStyle } from "react-native";
import { typography } from "../Theme/typography";
import { useTheme } from "../Context/ThemeContext";
import { cardShad } from "./GlassCard";

interface StatCardProps {
  value: string | number;
  label: string;
  className?: string;
  style?: ViewStyle;
  compact?: boolean;
  highlight?: boolean
}

const StatCard = ({ value, label, className = "", style, compact, highlight }: StatCardProps) => {
  const {colors} = useTheme()
  const onFill = highlight ? colors.white : colors.textPrimary
  return (
    <View
      className={`rounded-[18px] p-4 ${className}`}
      style={[{backgroundColor: highlight ? colors.primary : colors.surface}, cardShad, style]}
    >
      <Text
        className={compact ? typography.statNum : typography.cardValue}
        style={{ color: onFill}}
      >
        {value}
      </Text>
      <Text
        className={`${typography.statLbl} mt-1.5`}
        style={{ color: highlight ? "rgba(255,255,255,0.82)" : colors.textMuted }}
      >
        {label}
      </Text>
    </View>
  );
};
export default StatCard;


