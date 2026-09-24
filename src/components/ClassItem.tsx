import { Text, View } from "react-native";
import { typography } from "../Theme/typography";
import { ClassItem as ClassItemType } from "../types";
import { useTheme } from "../Context/ThemeContext";

interface ClassItemProps {
  item: ClassItemType;
  last?: boolean
}

const ClassItem = ({ item, last }: ClassItemProps) => {
  const {colors} = useTheme()
  return (
    <View>
      <View className="flex-row items-center gap-3.5 px-4 py-3.5">
        <View
          className="w-[3px] h-[34px] rounded-sm"
          style={{ backgroundColor: item.color || colors.primary }}
        />
        <View className="flex-1 gap-0.5">
          <Text className={typography.className} numberOfLines={1} 
           style={{color: colors.textPrimary}}>
            {item.name}
          </Text>
          {!!item.meta && (
          <Text className={typography.ClassMeta} style={{color: colors.textMuted}}>
            {item.meta}
          </Text>
          )}
        </View>
        <Text className="font-bold text-[13px] " style={{color: colors.textBody}}>{item.time}</Text>
      </View>
      {!last && <View className="h-px mx-4" style={{backgroundColor: colors.hairline}}/>}
    </View>
  );
};
export default ClassItem;
