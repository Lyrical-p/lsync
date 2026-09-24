import { Pressable, ScrollView, Text, View } from "react-native";
import { useTheme } from "../Context/ThemeContext";

interface ChipSelectorProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  fill?: boolean
}

const ChipSelector = ({ options, selected, onSelect, fill = true }: ChipSelectorProps) => {
  const {colors} = useTheme()
  const chip = (option: string) => {
    const active = option === selected
    return(
      <Pressable
        key={option} onPress={() => onSelect(option)}
        className={`${fill ? "flex-1" : ""} items-center rounded-[14px] py-2.5 active:opacity-70`}
        style={{backgroundColor: active ? colors.primary : "transparent"}}>
        <Text className="text-[13px] font-bold" style={{color: active ? colors.onInk : colors.textBody}}>
          {option}
        </Text>
      </Pressable>
    )
  }

  if (fill) {
    return(
      <View className="flex-row gap-1.5 px-[22px] mb-4">
        {options.map(chip)}
      </View>
    )
  }

  return(
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 px-[22px] mb-4">
      {options.map(chip)}
    </ScrollView>
  )
};
export default ChipSelector;
