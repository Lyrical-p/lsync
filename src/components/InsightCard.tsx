import { View, Text } from "react-native"
import { useTheme } from "../Context/ThemeContext"
import { MaterialCommunityIcons } from "@expo/vector-icons"



interface InsightCardProps{
    text: string
    title?: string
}


const InsightCard =({text, title}: InsightCardProps) => {
    const {colors, isDark} = useTheme()
    return(
        <View className="flex-row gap-3 rounded-[20px] p-4" style={{backgroundColor: colors.streakToday}}>
            <View className="w-7 h-7 rounded-[9px] items-center justify-center" style={{backgroundColor: colors.primary}}>
                <MaterialCommunityIcons name="brain" size={15} color={colors.white} />
            </View>
            <View className="flex-1 gap-1">
                {!!title && (
                    <Text className="text-[13px] font-bold" style={{color: isDark ? colors.accentLight : "#14603D"}}>{title}</Text>
                )}
                <Text className="text-[12.5px] leading-[19px] " style={{color: isDark ? colors.textBody : "#3E6650"}}>{text}</Text>
            </View>
            
        </View>
    )
}

export default InsightCard