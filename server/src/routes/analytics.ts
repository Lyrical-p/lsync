import { Router } from "express";
import { AuthRequest } from "../middleware/requireAuth";




const router = Router();

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SUBJECT_COLORS =["#22C55e", "#3b82f6", "#a78bfa", "#f97316", "#ef4444", "#0ea5e9", ];

function startofWeekIso(): string {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    return start.toISOString().slice(0, 10);
    
}

router.get("/", async(req: AuthRequest, res)=>{
    try{
        const weekStart = startofWeekIso();

        const {data: sessions, error} = await req .supabase!
            .from("study_sessions")
            .select("subject, minutes, logged_date")
            .gte("logged_date", weekStart);
        if (error) return res.status(500).json({error: error.message});
        
        const rows = sessions ?? [];

        const minutesByDay = new Array(7).fill(0);
        rows.forEach((r) => {
            const d = new Date(`${r.logged_date}T00:00:00`);
            minutesByDay[d.getDay()] += r.minutes;
        });

        const maxMinutes = Math.max(1, ...minutesByDay);
        const weeklyBars = minutesByDay.map((m, i) => ({
            height: Math.round((m/maxMinutes)*100),
            label: DAY_LABELS[i],
        }));

        const bySub = new Map<string, number>();
        rows.forEach((r) => {
            bySub.set(r.subject, (bySub.get(r.subject) ?? 0) + r.minutes);
        });
        const totalMinutes = rows.reduce((sum, r) => sum + r.minutes, 0);
        const subjectBreakDowns = Array.from(bySub.entries()).map(
            ([name, minutes], i) => ({
                name, percent:
                totalMinutes > 0 ? Math.round((minutes / totalMinutes)*100) : 0,
                color: SUBJECT_COLORS[i % SUBJECT_COLORS.length],
            }),
        );

        const {count: tasksDoneCount} = await req .supabase!
            .from("tasks")
            .select("*", {count: "exact", head: true})
            .eq("done", true)

        const {data: profile} = await req .supabase!
            .from("profiles")
            .select("current_streak")
            .eq("id", req.userId)
            .single()

        const totalHrs = Math.round((totalMinutes/60)*10)/10;

        const stats = [
            {value: `${totalHrs}h`, label: "Study time"},
            {value: String(rows.length), label: "Sessions"},
            {value: String(tasksDoneCount ?? 0), label: "Tasks done"},
            {value: String(profile?.current_streak ?? 0), label: "Day streak"},
        ];

        const insight = rows.length > 0 
            ? `You've logged ${rows.length} study session${rows.length === 1 ? "" : "s"} this week, totaling ${totalHrs}h. Keep it up.`
            : "Complete a few Pomodoro sessions this week to unlock peersonalized insights.";
        res.json({ stats, weeklyBars, subjectBreakDowns, insight });
     }catch (err){
        console.error("GET /analytics failed:", err)
        res.status(500).json({error: "Failed to load analytics"})
    }
});

export default router;