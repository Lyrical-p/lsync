import { Platform, View, ViewStyle } from "react-native";
import { useTheme } from "../Context/ThemeContext";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  flat?: boolean;
  rows?: boolean
}

export const cardShad = Platform.select({
  ios: {shadowColor: "#131614", shadowOpacity: 0.08, shadowRadius: 18, shadowOffset: {width:0, height:8}},
  default: {elevation: 2}
}) as ViewStyle

const GlassCard = ({ children, className = "", style, flat, rows }: GlassCardProps) => {
  const {colors} = useTheme()
  return (
    <View
      className={`rounded-[20px] ${rows ? "overflow-hidden" : "p-[18px]"} ${className}`} style={[{backgroundColor: colors.surface}, flat ? null : cardShad, style]}
    >
      {children}
    </View>
  );
};
export default GlassCard;
