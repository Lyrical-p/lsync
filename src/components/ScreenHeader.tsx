import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { typography } from "../Theme/typography";
import { useTheme } from "../Context/ThemeContext";
import { HEADER } from "../Theme/layout";
import { cardShad } from "./GlassCard";

interface ScreenHeaderProps {
  title: string
  subtitle?: string
  action?: string
  actionIcon?: keyof typeof MaterialCommunityIcons.glyphMap
  actionSubtitle?: string
  onAction?: () => void
}

const ScreenHeader = ({
  title,
  subtitle,
  action,
  actionIcon,
  actionSubtitle,
  onAction,
}: ScreenHeaderProps) => {
  const {colors} = useTheme()
  return (
    <View className="flex-row items-center justify-between px-[22px] pb-4" style={{paddingTop: HEADER}}>
      <View className="gap-1">
        <Text className={typography.hdrTitle} style={{color: colors.textPrimary}}>{title}</Text>
        {!!subtitle && <Text className={typography.hdrSub} style={{color: colors.textMuted}}>{subtitle}</Text>}
      </View>

      {actionSubtitle ? (
        <View className="h-9 flex-row items-center gap-1.5 rounded-xl px-3"
          style={[{backgroundColor: colors.surface}, cardShad]}>
          
          <Text className=" text-[13px] font-bold" style={{color: colors.textBody}}>{actionSubtitle}</Text>
          <MaterialCommunityIcons name="chevron-down" size={15} color={colors.textMuted}/>
        </View>
      ): action ? (
        <Pressable onPress={onAction} className="h-[38px] flex-row items-center gap-1.5 rounded-xl px-3.5 active:opacity-80"
          style={{backgroundColor: colors.primary}}>
          <MaterialCommunityIcons name={actionIcon ?? "plus"} size={17} color={colors.white}/>
          <Text className="text-[13.5px] font-bold" style={{color: colors.white}}>{action}</Text>
        </Pressable>
      ): null}
    </View>
  );
};
export default ScreenHeader;

interface QuickActionProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress?: () => void;
  primary?: boolean
}

export function QuickActionButton({ icon, label, onPress, primary }: QuickActionProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      className="flex-1 h-[50px] flex-row items-center justify-center gap-2 rounded-2xl active:opacity-80"
      style={[primary ? {backgroundColor: colors.primary} : {backgroundColor: colors.surface},
        primary ? null : cardShad
      ]}
      onPress={onPress}
    >
      <MaterialCommunityIcons name={icon} size={18} color={primary ? colors.white :colors.primary} />
      <Text className="text-[14px] font-bold" style={{color: primary ? colors.white : colors.textPrimary}}>{label}</Text>
    </Pressable>
  );
}
