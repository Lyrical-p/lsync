import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useTheme } from "../Context/ThemeContext";

interface PomodoroRingProps {
  secondsLeft: number;
  totalSeconds?: number;
  isRunning?: boolean
}

const SIZE = 224;
const STROKE = 14;
const RADIUS = (SIZE - STROKE)/2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const PomodoroRing = ({
  secondsLeft,
  totalSeconds = 1500, isRunning
}: PomodoroRingProps) => {
  const {colors} = useTheme()
  const elapsed = Math.max(0, Math.min(1, (totalSeconds -secondsLeft)/totalSeconds))
  const minutes = Math.floor(secondsLeft/60)
  const seconds = secondsLeft % 60
  const phase = isRunning ? "Focusing" : secondsLeft >= totalSeconds ? "Ready" : "Paused"


  return (
    <View className="self-center items-center justify-center" style={{ width: SIZE, height: SIZE }}>
      <Svg width={SIZE} height={SIZE} style={{position:"absolute", top:0, left:0}}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={colors.fill}
          strokeWidth={STROKE}
          fill="none"
        />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={colors.primary}
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1-elapsed)}
          strokeLinecap="round"
          rotation={-90}
          origin={`${SIZE / 2}, ${SIZE / 2}`}
        />
      </Svg>
      
        <Text className="font-extrabold text-[42px] tracking-tighter" style={{color: colors.textPrimary}}>
          {minutes}:{seconds<10 ? "0" : ""}{seconds}
        </Text>
        <Text className="text-[11px] font-bold uppercase tracking-[1.2px] mt-1.5" style={{color: colors.textMuted}}>{phase}</Text>
      
    </View>
  );
};
export default PomodoroRing;
