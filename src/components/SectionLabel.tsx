import { View, Text } from "react-native"
import { useTheme } from "../Context/ThemeContext"
import { typography } from "../Theme/typography"



interface SectionLabelProps {
    children: string
    right?: React.ReactNode
    className?: string
}

const SectionLabel = ({children, right, className=""} : SectionLabelProps) =>{
    const {colors} = useTheme();
    return(
        <View className={`flex-row items-baseline justify-between ${className}`}>
            <Text className={typography.sectionLabel} style={{color:colors.textMuted}}>{children}</Text>
            {right}
        </View>
    )
}


export default SectionLabel