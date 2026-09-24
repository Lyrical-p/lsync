import { SupabaseClient } from "@supabase/supabase-js";






export async function bumpStreak(supabase: SupabaseClient, userId: string){
    const today = new Date().toISOString().slice(0, 10);

    const {data: profile} = await supabase
        .from("profiles")
        .select("current_streak, last_active_date")
        .eq("id", userId)
        .single();
        
    if (!profile) return;
    if (profile.last_active_date === today) return;

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const nextStreak = profile.last_active_date === yesterday 
        ? (profile.current_streak ?? 0) + 1 : 1;


    await supabase
        .from("profiles")
        .update({current_streak: nextStreak, last_active_date: today})
        .eq("id", userId);
}