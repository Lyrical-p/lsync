import { useState } from "react";
import { useTheme } from "../Context/ThemeContext";
import { TaskTag } from "../types";
import { api } from "../api/client";
import { Modal, View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform } from "react-native";



const tags: TaskTag[] = ["Normal", "Urgent", "Exam", "Medium", "Later"]

function toISODate(date: Date): string {
    return date.toISOString().slice(0,10);
}

function quickDates() {
    const today = new Date();
    const tomorrow = new Date(Date.now() + 86400000);
    const nestWeek = new Date(Date.now() + 7*86400000);
    return{
        today: toISODate(today),
        tomorrow: toISODate(tomorrow),
        nestWeek: toISODate(nestWeek)
    };
}

interface AddTaskProps {
    visible: boolean;
    onClose: () => void;
    onCreated: () => void
}


const AddTask = ({visible, onClose, onCreated}: AddTaskProps) => {
    const {colors} = useTheme();
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [tag, setTag] = useState<TaskTag>("Normal");
    const [dueDate, setDueDate] = useState("");
    const [error, setError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    
    const reset =() => {
        setTitle("");
        setSubtitle("");
        setTag("Normal");
        setDueDate("");
        setError(null);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleCreate = async () => {
        if (!title.trim()) {
            setError("Give the task a title.")
            return
        }
        if(dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)){
            setError("Due date must be in YYYY-MM-DD format.");
            return;
        }
        setError(null);
        setSaving(true);
        try{
            const today = toISODate(new Date());
            const section = !dueDate || dueDate === today ? "today" : "upcoming";
            await api.createTask({
                title: title.trim(),
                subtitle: subtitle.trim(),
                tag, section,
                dueDate: dueDate || undefined,
            })
            reset();
            onCreated();
        } catch(err) {
            setError(err instanceof Error ? err.message : "Couldn't create task.")
        }finally {setSaving(false)}
    
    }

    const dates = quickDates();

    return(
        <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
            <KeyboardAvoidingView className="flex-1 justify-end" style={{backgroundColor:"rgba(0,0,0,0.4"}}
              behavior={Platform.OS === "ios" ? "padding":"height"}>
                <View className="flex-1 justify-end" style={{backgroundColor: "rgba(0,0,0,0.4"}}>
                    <View className="rounded-t-3xl p-5 gap-3.5" style={{backgroundColor: colors.surface}}>
                        <Text className="text-base font-bold text-center" style={{color: colors.textPrimary}}>
                            New Task
                        </Text>
                        <TextInput placeholder="Title" placeholderTextColor={colors.placeholder}
                        value={title} onChangeText={setTitle} className="rounded-xl px-4 py-3 text-[15px] border"
                        style={{borderColor: colors.border, color: colors.textPrimary}}/>
                            
                        <TextInput placeholder="Subtitle" placeholderTextColor={colors.placeholder}
                        value={subtitle} onChangeText={setSubtitle} className="rounded-xl px-4 py-3 text-[15px] border"
                        style={{borderColor: colors.border, color: colors.textPrimary}}/>

                        <View className="flex-row flex-wrap gap-2">
                            {tags.map((t) => {const active = t === tag;
                                return(
                                    <Pressable key={t} onPress={() => setTag(t)}
                                    className="px-3 py-1.5 rounded-full border"
                                    style={{backgroundColor: active ? colors.primary : "transparent",
                                    borderColor: active ? colors.primary : colors.border}}>
                                        <Text className="text-xs font-medium" style={{color: active ? colors.white : colors.textSecondary}}>
                                            {t}
                                        </Text>
                                    </Pressable>
                                )
                            })}
                        </View>

                        <View className="gap-2">
                            <Text className="text-xs font-medium" style={{color: colors.textSecondary}}>
                                Due date (option)
                            </Text>
                            <View className="flex-row gap-2">
                                <Pressable onPress={() => setDueDate(dates.today)}
                                className="px-3 py-1.5 rounded-full border"
                                style={{borderColor: colors.border}}>
                                    <Text className="text-xs" style={{color: colors.textSecondary}}>Today</Text>
                                </Pressable>
                                <Pressable onPress={() => setDueDate(dates.tomorrow)}
                                className="px-3 py-1.5 rounded-full border"
                                style={{borderColor: colors.border}}>
                                    <Text className="text-xs" style={{color: colors.textSecondary}}>Tomorrow</Text>
                                </Pressable>
                                <Pressable onPress={() => setDueDate(dates.nestWeek)}
                                className="px-3 py-1.5 rounded-full border"
                                style={{borderColor: colors.border}}>
                                    <Text className="text-xs" style={{color: colors.textSecondary}}>Next week</Text>
                                </Pressable>
                            </View>
                            <TextInput placeholder="YYYY-MM-DD" placeholderTextColor={colors.placeholder}
                            value={dueDate} onChangeText={setDueDate} className="rounded-xl px-4 py-3 text-[15px] border"
                            style={{borderColor: colors.border, color: colors.textPrimary}}/>
                        </View>
                        
                        {error &&(
                            <Text className="text-sm text-center" style={{color: colors.red}}>
                                {error}
                            </Text>
                        )}

                        <View className="flex-row gap-3 mt-1">
                        <Pressable onPress={handleClose} 
                                className="flex-1 items-center py-3 rounded-full border"
                                style={{borderColor: colors.border}}>
                                <Text className="font-semibold" style={{color: colors.textSecondary}}>
                                Cancel
                                </Text>
                            </Pressable>

                            <Pressable onPress={handleCreate} disabled={saving}
                                className="flex-1 items-center py-3 rounded-full "
                                style={{backgroundColor: colors.primary, opacity: saving ? 0.6 : 1}}>
                                
                                <Text className="font-semibold" style={{color: colors.white}}>
                                {saving ? "Adding..." : "Add Task"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}



export default AddTask