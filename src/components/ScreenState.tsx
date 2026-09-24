import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useTheme } from "../Context/ThemeContext";

interface ScreenStateProps {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
}

const ScreenState = ({
  loading,
  error,
  onRetry,
  children,
}: ScreenStateProps) => {
  const {colors} = useTheme()

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-base font-medium mb-2" style={{color: colors.textPrimary}}>
          Could not load data
        </Text>
        <Text className="text-[13px] text-center mb-4" style={{color: colors.textSecondary}}>
          {error}
        </Text>
        {onRetry && (
          <Pressable
            className="rounded-full px-5 py-[10px]"
            style={{backgroundColor: colors.primary}}
            onPress={onRetry}
          >
            <Text className="text-white font-medium">Retry</Text>
          </Pressable>
        )}
      </View>
    );
  }

  return <>{children}</>;
};
export default ScreenState;
