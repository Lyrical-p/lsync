import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import {  TaskData } from "../types";
import { useTheme } from "../Context/ThemeContext";
import { typography } from "../Theme/typography";

interface TaskItemProps {
  task: TaskData
  onToggle?: () => void
  onDelete?: () => void
  last?: boolean
}

const TaskItem = ({ task, onToggle, onDelete, last }: TaskItemProps) => {
  const {colors, tagColors} = useTheme()
  const tag = tagColors[task.tag];
  return (
    <View>
      <Pressable
        className="flex-row items-center gap-3 px-4 py-[15px] active:opacity-70"
        onPress={onToggle} onLongPress={onDelete} delayLongPress={400}
      >
        <View
          className="w-[22px] h-[22px] rounded-[7px] items-center justify-center " 
          style={task.done ? { backgroundColor: colors.primary} : {borderWidth: 1.6, borderColor: colors.placeholder}}>
          {task.done && <MaterialCommunityIcons name="check" size={14} color={colors.white} />}
        </View>

        <View className="flex-1 gap-0.5">
          <Text
            className={task.done ? "text-[14.5px] font-semibold tracking-tight" : typography.taskText} numberOfLines={1}
            style={{
              color: task.done ? colors.textMuted : colors.textPrimary,
              textDecorationLine: task.done ? "line-through" : "none",
            }}
          >
            {task.title}
          </Text>


          {!!task.subtitle &&                                                                      (
          <Text
            className={typography.taskMeta}
            style={{ color: task.done ? colors.placeholder : colors.textMuted}}
          >
            {task.subtitle}
          </Text>)}
        </View>
        {!task.done && ( 
        <View
          className="px-2.5 py-1.5 rounded-lg" style={{backgroundColor: tag.bg}} >
          <Text className={typography.tag} style={{color: tag.text}}>{task.tag}</Text>
        </View>)}
      </Pressable>
      {!last && <View className="h-px mx-4" style={{backgroundColor: colors.hairline}}/>}
    </View>
  );
};
export default TaskItem;
