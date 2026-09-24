import { Router } from "express";
import { AuthRequest } from "../middleware/requireAuth";



const router = Router();

function initialsFor(name: string) {
    return (
        name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((p) => p[0]?.toUpperCase())
            .join("") || "?"
    );
}

router.get("/", async (req: AuthRequest, res) => {
    try{
        const {data: profile, error} = await req .supabase!
            .from("profiles")
            .select("*")
            .eq("id", req.userId)
            .single();
        if(error || !profile) {
            return res.status(404).json({error: "Profile not found"});
        }

        const {count: taskDoneCount} = await req .supabase!
            .from("tasks")
            .select("*", {count: "exact", head: true})
            .eq("done", true);

        const {count: totalTaskCount} = await req .supabase!
            .from("tasks")
            .select("*", {count: "exact", head: true});

        const onTimePercent = totalTaskCount && totalTaskCount > 0
            ? Math.round(((taskDoneCount ?? 0) / totalTaskCount)*100) : 0;

        const name = profile.full_name || req.userEmail?.split("@")[0] || "Student";

        res.json({
            name,
            email: req.userEmail ?? "",
            initials: initialsFor(name),
            streak: profile.current_streak ?? 0,
            onTimePercent,
            taskDone: taskDoneCount ?? 0,
            notifyTasks: profile.notify_tasks ?? true,
            notifyClasses: profile.notify_classes ?? true,
            notifyHabits: profile.notify_habits ?? true,
            notifySchedule: profile.notify_schedule ?? true,

            darkMode: profile.dark_mode ?? false,
        });
     }catch (err){
        console.error("GET /profile failed:", err)
        res.status(500).json({error: "Failed to load profile"})
    }
});

router.patch("/goal", async (req: AuthRequest, res)=>{
    try{
        const {target } = req.body?? {};
        if (typeof target !== "number" || !Number.isInteger(target) || target < 1 || target> 50){ 
            return res.status(400).json({error: "taget must be a whole number between 1 and 50"});
        }
        const {data, error} = await req.supabase!
            .from("profiles")
            .update({daily_goal_target:target})
            .eq("id", req.userId)
            .select()
            .single()
        
        if (error) return res.status(500).json({error: error.message});

        res.json({target: data.daily_goal_target});
    } catch(err){
        console.error("PATCH /profile:", err);
        res.status(500).json({error: "Failed to update daily goal"})
    }
})

router.patch("/settings", async (req: AuthRequest, res) => {
    try{
        const {notifyTasks, notifyClasses, notifyHabits, notifySchedule, darkMode} = req.body ?? {};
        const updates: Record<string, unknown> = {};
        if (typeof notifyTasks === "boolean") updates.notify_tasks = notifyTasks;
        if (typeof notifyClasses === "boolean") updates.notify_classes = notifyClasses;
        if (typeof notifyHabits === "boolean") updates.notify_habits = notifyHabits;
        if (typeof notifySchedule === "boolean") updates.notify_Schedule = notifySchedule;
        if (typeof darkMode === "boolean") updates.dark_mode = darkMode;

        const {data, error} = await req .supabase!
            .from("profiles")
            .update(updates)
            .eq("id", req.userId)
            .select()
            .single();
        if (error) return res.status(500).json({error: error.message});

        res.json({
            notifyTasks: data.notify_tasks, 
            notifyClasses: data.notify_classes, 
            notifyHabits: data.notify_habits, 
            notifySchedule: data.notify_schedule, 
            darkMode: data.dark_mode
        });
     }catch (err){
        console.error("PATCH /profile failed:", err)
        res.status(500).json({error: "Failed to profile settings"})
    }
});


export default router;
