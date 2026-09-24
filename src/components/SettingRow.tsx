import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { typography } from "../Theme/typography";
import { useTheme } from "../Context/ThemeContext";

interface SettingRowProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconBg: string;
  iconColor: string;
  label: string;
  meta?: string
  type: "toggle" | "chevron" | "none";
  value?: boolean;
  onToggle?: () => void;
  onPress?: () => void;
  labelColor?: string;
  last?: boolean
}

const SettingRow = ({
  icon,
  iconBg,
  iconColor,
  label,
  meta,
  type,
  value,
  onToggle,
  onPress,
  labelColor,
  last,
}: SettingRowProps) => {
  const {colors} = useTheme()
  const handlePress = type === "toggle" ? onToggle : onPress;
  return (
    <View>
      <Pressable onPress={handlePress} disabled={!handlePress} className="flex-row 
        items-center gap-3 px-4 py-[14px] active:opacity-70">

        {!!icon && (
          <View className="w-[34px] h-[34px] rounded-[11px] items-center justify-center"
            style={{backgroundColor: iconBg ?? colors.streakToday}}>
            <MaterialCommunityIcons name={icon} size={16} color={iconColor ?? colors.primary}/>
          </View>
        )}

        <View className="flex-1 gap-0.5">
          <Text className={typography.settingLabel} style={{color: labelColor ?? colors.textPrimary}}>{label}</Text>
          {!!meta && <Text className={typography.settingMeta} style={{color: colors.placeholder}}>{meta}</Text>}
        </View>

        {type === "toggle" && (
          <View className="w-[46px] h-7 rounded-full justify-center px-[3px] "
            style={{backgroundColor: value ? colors.primary : colors.fill}}>
              <View className={`w-[22px] h-[22px] rounded-full ${value ? "self-end" : "self-start"} `}
                style={{backgroundColor: colors.white}}/>

          </View>
        )}
        {type === "chevron" && (
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.placeholder}/>
        )}
      </Pressable>
      {!last && <View className="h-px mx-4" style={{backgroundColor: colors.hairline}}/>}
    </View>
  )
    
};
export default SettingRow;
