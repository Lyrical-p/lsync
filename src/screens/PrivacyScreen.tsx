
import { router } from 'expo-router'
import { View, Text, Alert, ScrollView, TextInput, ActivityIndicator, Pressable } from 'react-native'
import { useAuth } from '../Context/AuthContext';
import { useState } from 'react';
import { api } from '../api/client';
import { useTheme } from '../Context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';




const PrivacyScreen = () => {
    const {colors} = useTheme();
    const {changePassword, signOut} = useAuth();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pdError, setPdError] = useState<string | null>(null);
    const [pdSuccess, setPdSuccess] = useState<string | null>(null);
    const [pdSaving, setPdSaving] = useState(false);
    const [deleting, setDeleting] = useState(false)
    const inset = useSafeAreaInsets()

    const handleChangePassword = async () => {
        if(!newPassword || newPassword.length < 8) {
            setPdError("Password must be at least 8 characters.");
            setPdSuccess(null)
            return;
        }
        if (newPassword !== confirmPassword){
            setPdError("Password don't match.");
            setPdSuccess(null);
            return;
        }
        setPdError(null);
        setPdSaving(true);
        setPdSuccess(null)
        const {error } = await changePassword(newPassword);
        setPdSaving(false);

        if (error) {
            setPdError(error); return;
        }

        setNewPassword("");
        setConfirmPassword("");
        setPdSuccess("Password updated.")
    };

    const confirmDelete = () => {
        Alert.alert(
            "Delete your account?",
            "This permamently deletes your account and all you data (tasks, habit, schedule, everything). This can't be undone.",
            [{text: "Cancel", style: "cancel"},
             {
                text: "Delete",
                style: "destructive",
                onPress: handleDelete,
             }
            ]
        )
    }


    const handleDelete = async () => {
        setDeleting(true);
        try{
            await api.deleteAccount();
            await signOut();
            router.replace("/(auth)/SplashScreen")
        }catch (err) {
            setDeleting(false);
            Alert.alert("Couldn't delete account",
                err instanceof Error ? err.message : "Something went wrong.",
            )
        }
    }

  return (
    <ScrollView className='flex-1 gap' style={{backgroundColor: colors.bg}}
      contentContainerStyle={{paddingHorizontal: 20, paddingBottom:40, gap: 24, paddingTop: inset.top + 40}}>
      <View className='gap-3'>
        <Text className='text-base font-bold' style={{color: colors.textSecondary}}>
            Change Password
        </Text>
        <TextInput 
          placeholder='New password'
          placeholderTextColor={colors.placeholder}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          autoCapitalize='none'
          autoCorrect={false}
          className='rounded-xl px-4 py-3 text-[15px] border'
          style={{ borderColor: colors.border, color: colors.textPrimary}}
        />
        <TextInput 
          placeholder='Confirm new password'
          placeholderTextColor={colors.placeholder}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize='none'
          autoCorrect={false}
          className='rounded-xl px-4 py-3 text-[15px] border'
          style={{ borderColor: colors.border, color: colors.textPrimary}}
        />
        {pdError && (
            <Text className='text-sm' style={{color:colors.red}}>{pdError}</Text>
        )}
        {pdSuccess && (
            <Text className='text-sm' style={{color:colors.primary}}>{pdSuccess}</Text>
        )}
        {pdSaving ? (
            <ActivityIndicator size="small" color={colors.primary}/>
        ) : (
            <Pressable onPress={handleChangePassword}
              className='items-center py-3 rounded-full'
              style={{backgroundColor: colors.primary}}>
                <Text className='font-semibold' style={{color: colors.white}}>Update Password</Text>
            </Pressable>
        )}
      </View>

      <View className='h-[1px]' style={{backgroundColor: colors.border}}/>

      <View className='gap-3'>
        <Text className='text-base font-bold' style={{color: colors.textPrimary}}>
            Delete Account
        </Text>
        <Text>
            Permanently deletes your account and all associated data.
            This cannot be undone.
        </Text>
        {deleting ? (
            <ActivityIndicator size="small" color={colors.red}/>
        ) : (
            <Pressable
              onPress={confirmDelete}
              className="items-center py-3 rounded-full border"
              style={{borderColor: colors.red}}>
                <Text className="font-semibold" style={{color: colors.red}}>
                    Delete My Account
                </Text>
            </Pressable>
        )}
      </View>
    </ScrollView>
  )
}


export default PrivacyScreen