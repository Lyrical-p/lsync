import { SupabaseClient } from "@supabase/supabase-js";
import { Router } from "express";
import { AuthRequest } from "../middleware/requireAuth";



const router = Router();
const DEFAULT_SECONDS = 25 * 60;
const SESSION_MINUTES = 25;

interface PomodoroRow{
    seconds_left: number;
    is_running: boolean;
    session_count: number;
    focused_minutes: number;
    break_count: number;
}

function mapState(row: PomodoroRow) {
    return {
        secondsLeft: row.seconds_left,
        isRunning: row.is_running,
        sessionCount: row.session_count,
        focusedTime: row.focused_minutes,
        breakCount: row.break_count,
        focusLabel: row.is_running ? "Focus session in progress" : "Ready to focus",
    };
}


async function getOrCreateState(supabase: SupabaseClient, userId: string){
    const {data, error: selectError} = await supabase
        .from("pomodoro_state")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
     
    if (selectError) throw new Error(selectError.message)    
    if (data) return data as PomodoroRow;

    const {data: created, error: insertError} = await supabase
        .from("pomodoro_state")
        .upsert({user_id: userId}, {onConflict: "user_id"})
        .select()
        .single();

    if (insertError || !created) {
        throw new Error(insertError?.message ?? "Failed to create pomodoro state")
    }   
    return created as PomodoroRow;
}

router.get("/", async (req: AuthRequest, res) => {
   try {const state = await getOrCreateState(req.supabase!, req.userId!);
    res.json(mapState(state));
    }catch (err){
        res.status(500).json({error: err instanceof Error ? err.message : "Server error"})
    }
});

router.patch("/", async (req: AuthRequest, res) => {
    try {const {secondsLeft, isRunning, reset} = req.body ?? {};
        const current = await getOrCreateState(req.supabase!, req.userId!);

        if (reset) {
            const {data, error} = await req
                .supabase!.from("pomodoro_state")
                .update({
                    seconds_left: DEFAULT_SECONDS,
                    is_running: false,
                    updated_at: new Date().toISOString(),
                })
                .eq("user_id", req.userId)
                .select()
                .single();
            if (error) return res.status(500).json({error: error.message});
            return res.json(mapState(data));       
        }

        const justFinished = current.is_running && secondsLeft === 0;
        const updates: Record<string,unknown> = {
            updated_at: new Date().toISOString(),
        };
        if (typeof secondsLeft === "number") updates.seconds_left = secondsLeft;
        if (typeof isRunning === "boolean") updates.is_running = isRunning;

        if (justFinished) {
            updates.session_count = current.session_count + 1;
            updates.focused_minutes = current.focused_minutes + SESSION_MINUTES;
            updates.seconds_left = DEFAULT_SECONDS;
            updates.is_running = false;
        }

        const { data, error } = await req
            .supabase!.from("pomodoro_state")
            .update(updates)
            .eq("user_id", req.userId)
            .select()
            .single();
        if (error) return res.status(500).json({ error: error.message});

        if (justFinished) {
            await req.supabase!.from("study_sessions").insert({
                user_id: req.userId,
                subject: "General Study",
                minutes: SESSION_MINUTES,
            });
        }

        res.json(mapState(data));
} catch (err){
    res.status(500).json({error: err instanceof Error ? err.message : "Server error"})
}
});

export default router;