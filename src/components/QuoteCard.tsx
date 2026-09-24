
import { Text, View } from "react-native";
import { useTheme } from "../Context/ThemeContext";

interface QuoteCardProps {
  text: string;
  author: string;
}

const QuoteCard = ({ text, author }: QuoteCardProps) => {
  const {colors} = useTheme()
  return (
    <View className="rounded-[20px] p-[18px] gap-2" style={{backgroundColor: colors.quoteStart}}>
      <Text className="text-[13.5px] leading-[21px]" style={{color: colors.textBody}}>{text}</Text>
      <Text className="text-[11.5px] font-bold" style={{color: colors.textMuted}}>{author}</Text>
    </View>
  );
};
export default QuoteCard;
