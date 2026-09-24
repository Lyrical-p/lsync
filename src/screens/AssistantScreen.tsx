import { View, Text, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Pressable, TextInput } from 'react-native'
import { api, ChatMessage } from '../api/client';
import { useCallback, useRef, useState } from 'react';
import ScreenHeader from '../components/ScreenHeader';

import { Feather } from '@expo/vector-icons';
import { useTheme } from '../Context/ThemeContext';
import { withOpacity } from '../Theme/colors';
import GlassCard, { cardShad } from '../components/GlassCard';
import { TAB_BAR_CLEARANCE } from '../Theme/layout';






interface Message {
    id: string;
    role: "user" | "assistant"
    content: string;
}

let messageIdCounter = 0;
const nextId = () => `msg-${Date.now()}-${messageIdCounter += 1}`;


const WELCOME_MESSAGE: Message = {
    id: "welcome",
    role: "assistant",
    content: "Hello! I'm your study assistant. Ask me to explain a concept, help plan your study, or break down an assignment into steps."
};

const SUGGESTIOONS = ["Plan my week", "Quiz me", "Break down an assignment"]

const toApiMessages=(messages: Message[]): ChatMessage[] =>
    messages.map(({role, content}) => ({role, content}));






const AssistantScreen = () => {
    const {colors} = useTheme()
    const[messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
    const[inputText, setInputText] = useState("");
    const[sending, setSending] = useState(false);
    const[error, setError] = useState<string | null>(null);
    const scrollRef = useRef<ScrollView>(null);

    const scrollToEnd  = useCallback(() => 
        scrollRef.current?.scrollToEnd({animated: true})
    , []);

    const sendMessage = async (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || sending) return;

        const history = [...messages, {id: nextId(), role: "user" as const, content: trimmed}];

        setMessages(history);
        setInputText("");
        setError(null);
        setSending(true)

        try {
            const {reply} = await api.sendChatMessage(toApiMessages(history));
            setMessages((prev) => [...prev, {
                id: nextId(), role: "assistant", content: reply
            }]);
        }catch (err) {
            setError(err instanceof Error ? err.message : "Couldnn't reach the assistant.");
        } finally {
            setSending(false);
        }
    };

    const handleRetry =() => {
        const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
        if (lastUserMessage) sendMessage(lastUserMessage.content)
    };



  return (
    <KeyboardAvoidingView className='flex-1 justify-end' style={{backgroundColor: colors.bg}} behavior={Platform.OS === "ios" ? "padding" : undefined}
       keyboardVerticalOffset = {Platform.OS === "ios" ? 0:0}>

        <ScreenHeader title='Study Assistant' subtitle='Powered by OpenAI'/>

        <ScrollView ref={scrollRef} className='flex-1' contentContainerStyle={{paddingHorizontal: 22, paddingBottom: 16, gap: 12}} onContentSizeChange={scrollToEnd} showsVerticalScrollIndicator={false}>
            {messages.map((message) => message.role === "user" ? (
                <View key={message.id} 
                    className="self-end max-w-[80%] rounded-[20px] rounded-br-md px-4 py-3"
                    style={{backgroundColor: colors.primary}}>
                    <Text className="text-[14px] leading-[21px]" style={{color: colors.white}}>{message.content}</Text>
                </View>
            ) :(
                <GlassCard key={message.id} className="self-start max-w-[86%] rounded-[20px] rounded-bl-md px-4 py-3.5">
                    <Text className="text-[14px] leading-[22px]" style={{color: colors.textPrimary}}>
                        {message.content}
                    </Text>
                </GlassCard>
            ))}


            {sending && (
                <GlassCard className='self-start rounded-[20px] rounded-bl-md px-4 py-3 flex-row items-center gap-2'>                
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text className='text-[13px] font-semibold' style={{color: colors.textMuted}}>Thinkng...</Text>
                </GlassCard>
            )}

            {error && (
                <View className='self-start max-w-[86%] rounded-[20px] px-4 py-3 gap-2 '
                      style={{backgroundColor: withOpacity(colors.red, 0.08),
                        borderColor: withOpacity(colors.red, 0.2)
                      }}>
                    <Text className='text-[13px] font-semibold' style={{color: colors.red}}>{error}</Text>
                    <Pressable 
                       onPress = {handleRetry}
                       className='self-start rounded-xl px-3 py-1.5' style={{backgroundColor: colors.red}}>
                        <Text className='text-[12px] font-bold' style={{color: colors.white}}>Retry</Text>
                    </Pressable>
                </View>
            )}
        </ScrollView>

        <View className='gap-2.5 px-[18px] pt-3 ' style={{backgroundColor:colors.bg, paddingBottom: TAB_BAR_CLEARANCE}}>
            {messages.length <= 1 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8}}>
                    {SUGGESTIOONS.map((s) => (
                        <Pressable key={s} onPress={() => sendMessage(s)} 
                            className='rounded-full px-3 py-2 active:opacity-70' style={[{backgroundColor: colors.surface}, cardShad]}>
                            <Text className='text-[12.5px] font-semibold' style={{color: colors.textBody}}>{s}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            )}
        

            <View className='flex-row items-center gap-2.5 py-2 pl-4 pr-2 rounded-[18px]' style={{backgroundColor: colors.surface}}>
                <TextInput
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmitEditing={()=>sendMessage(inputText)}
                    placeholder = "Ask your study assistant..."
                    placeholderTextColor={colors.placeholder}
                    multiline
                    className="flex-1 max-h-[96px] text-[14px] font-medium" 
                    style={{color: colors.textPrimary}} 
                />

                <Pressable 
                    onPress={() => sendMessage(inputText)}
                    disabled={sending || !inputText.trim()} 
                    className="rounded-[13px] w-10 h-10 items-center justify-center"
                    style={{backgroundColor: sending || !inputText.trim() ? colors.disabled : colors.primary}}
                    >
                    <Feather name='arrow-up' size={19} color={colors.white} />
                </Pressable>
            </View>
        </View>
    </KeyboardAvoidingView>
  );
};
export default AssistantScreen