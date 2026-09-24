import { useTheme } from "../Context/ThemeContext"
import { useState } from "react"
import { api } from "../api/client"
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native"




const days = [
    {label: "Sun", value:0},
    {label: "Mon", value:1},
    {label: "Tue", value:2},
    {label: "Wed", value:3},
    {label: "Thu", value:4},
    {label: "Fri", value:5},
    {label: "Sat", value:6},

]

const hour_slots = [
    "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM",
    "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM"
]

interface ClassModalProps {
    visible: boolean
    onClose: () => void
    onCreated: () => void
}


const ClassModal = ({visible, onClose, onCreated} : ClassModalProps) => {
    const {colors} = useTheme();
    const [name, setName]= useState("")
    const [dayOfWeek, setDayOfWeek] = useState(1)
    const [hourIndex, setHourIndex] = useState(2)
    const [category, setCotegory] = useState<"personal" | "school">("school");
    const [error, setError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)


    const reset =() => {
        setName("")
        setDayOfWeek(1)
        setHourIndex(2)
        setCotegory("school")
        setError(null)
    }

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleCreate = async () => {
        if(!name.trim()) {
            setError("Give the class a name.")
            return;
        }

        setError(null);
        setSaving(true);
        try {
            const time = hour_slots[hourIndex];
            await api.createClass({name: name.trim(), time, dayOfWeek, hourIndex, category})
            reset();
            onCreated();
           
        } catch (err) {
            setError(err instanceof Error ? err.message :" Couldn't create class.")
        } finally{
            setSaving(false)
        }
    }

    return(
        <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
             <KeyboardAvoidingView className="flex-1 justify-end" style={{backgroundColor:"rgba(0,0,0,0.4"}}
                          behavior={Platform.OS === "ios" ? "padding":"height"}>
                <View className="flex-1 justify-end " style={{backgroundColor: "rgba(0,0,0,0.4)"}}>
                    <View className="rounded-t-3xl p-5 gap-3.5" style={{backgroundColor: colors.surface}}>
                        <Text className="text-base font-bold text-center" style={{color: colors.textPrimary}}>
                            New Class
                        </Text>

                        <TextInput placeholder="Class name" placeholderTextColor={colors.placeholder}
                            value={name} onChangeText={setName} className="rounded-xl px-4 py-4 text-[15px] border"
                            style={{borderColor: colors.border, color: colors.textPrimary}} />

                        <View className="gap-2.5">
                            <Text className="text-xs font-medium" style={{color: colors.textSecondary}}>
                                Day of Week
                            </Text>
                            <View className="flex-row flex-wrap gap-2">
                                {days.map((d) => {
                                    const active = d.value === dayOfWeek;
                                    return(
                                        <Pressable key={d.value} onPress={() => setDayOfWeek(d.value)}
                                            className="px-3 py-1.5 rounded-full border"
                                            style={{backgroundColor: active ? colors.primary : "transparent",
                                            borderColor: active ? colors.primary : colors.border}}>
                                            
                                            <Text className="text-xs font-medium" style={{color: active ? colors.white : colors.textSecondary}}>
                                                {d.label}</Text>
                                        </Pressable>
                                    )
                                })}
                            </View>

                            <View>
                                <Text className="text-xs font-medium" style={{color: colors.textSecondary}}>
                                    Time
                                </Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View className="flex-row gap-2 pr-2">
                                        {hour_slots.map((label, index) => {
                                            const active = index === hourIndex;
                                            return(
                                                <Pressable key={label} onPress={() => setHourIndex(index)}
                                                className="px-3 py-2 rounded-full border" style={{backgroundColor: active ? colors.primary : "transparent",
                                                borderColor: active? colors.primary : colors.border
                                                }}>
                                                    <Text style={{color: active ? colors.white : colors.textSecondary}}>{label}</Text>
                                                </Pressable>
                                            )
                                        }) }
                                    </View>
                                </ScrollView>
                            </View>

                            <View className="gap-2.5">
                                <Text className="text-xs font-medium" style={{color: colors.textSecondary}}>
                                    Category
                                </Text>
                                <View className="flex-row gap-2">
                                    {(["personal", "school"] as const).map((c) => {
                                        const active = c === category;
                                        return(
                                            <Pressable key={c} onPress={() => setCotegory(c)} 
                                            className="p-3 py-1.5 rounded-full border"
                                            style={{backgroundColor: active ? colors.primary : "transparent",
                                                borderColor: active ? colors.primary : colors.border
                                            }}>
                                                <Text className="text-xs font-medium capitalize" style={{color: active ? colors.white : colors.textSecondary}}>
                                                    {c}
                                                </Text>
                                            </Pressable>
                                        )
                                    })}
                                </View>
                            </View>

                            {error && (
                                <Text className="text-sm text-center" style={{color:colors.red}}>
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
                                    {saving ? "Adding..." : "Add Class"}
                                </Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}

export default ClassModal