import { Router } from "express";
import { AuthRequest } from "../middleware/requireAuth";
import { title } from "process";




const router = Router();

const QUOTES = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain"},
    { text: "Succes is the sum of small efforts repeated  daily.", author: "Robert Collier"},
    { text: "Discipline is choosing between what you want and what you want most.", author: "Abraham Lincoln"},
    { text: "It always seem impoosible until it's done.", author: "Nelson Mandela"},
    { text: "Well done is better than well said.", author: "Benjamin Franklin"}
];

function greetingForHour(hour: number) {
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon"
    return "Good evening";
}

function initialsFor(name: string){
    return(
        name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((p) => p[0]?.toUpperCase())
            .join("") || "?"
    );
}

function getAcademicYear(): string{
    const now =new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1

    if (month >= 10){
        return`${year}/${year+1}`
    }else {
        return `${year-1}/${year}`
    }
}

router.get("/", async (req:AuthRequest, res) => {
    try{
        const userId = req.userId!;
        const supabase = req.supabase!;

        const {data: profile} = await supabase
            .from("profiles")
            .select("full_name, current_streak, semester, daily_goal_target")
            .eq("id", userId)
            .single();

        const email = req.userEmail ?? "";
        const name = profile?.full_name || email.split("@")[0] || "Student";

        const today = new Date();
        const dayOfWeek = today.getDay();

        const { data: classes } = await supabase
            .from("classes")
            .select("*")
            .eq("day_of_week", dayOfWeek)
            .order("time", {ascending: true});

        const { data: deadlines } = await supabase
            .from("tasks")
            .select("*")
            .eq("section", "upcoming")
            .order("created_at", {ascending: true})
            .limit(5);
        
        const { data: completions } = await supabase
            .from("tasks")
            .select("completed_at")
            .not("completed_at", "is", null)
            .gte("completed_at", new Date(Date.now() - 7*86400000).toISOString());


        const completionDates = new Set(
            (completions ?? []).map((c) => (c.completed_at as string).slice(0, 10)),

        );

        const streakDays = Array.from({length:7}).map((_, i) => {
            const d = new Date(Date.now() - (6 -i)*86400000);
            const iso = d.toISOString().slice(0, 10);
            const isToday = i === 6;
            return {
                label: d.toLocaleDateString("en-US", {weekday: "short"}).slice(0, 2),
                letter: d.toLocaleDateString("en-US", {weekday: "narrow"}),
                state: completionDates.has(iso) ? ("done" as const) : isToday ? ("today" as const) : ("empty" as const),
            };
        });

        const todayIso = today.toISOString().slice(0, 10);
        const current = (completions ?? []).filter((c) =>(
            c.completed_at as string
        ).startsWith(todayIso),).length;

        const target = profile?.daily_goal_target ?? 5;

        const quoteIndex = Math.floor(today.getTime()/86400000) % QUOTES.length;

        res.json({
            user: {
                name, email,
                initials: initialsFor(name),
                streak: profile?.current_streak ?? 0,
                semester: getAcademicYear(),
                greeting: greetingForHour(today.getHours()),
            },

            streakDays,
            classes: (classes ?? []).map((c) => ({
                id: c.id,
                name: c.name,
                meta: c.meta ?? "",
                time: c.time,
                color: c.color,
                dayOfWeek:c.day_of_week,
                category: c.category ?? "school"
            })),

            deadlines: (deadlines ?? []).map((t)=>({
                id: t.id,
                title: t.title,
                subtitle: t.subtitle ?? "",
                tag: t.tag ?? "Normal",
                done: t.done,
                subtitleColor: t.subtitle_color ?? undefined,
            })),

            quote: QUOTES[quoteIndex],
            dailyGoal: {
                current,
                target,
                percent: Math.min(100, Math.round((current/target)*100)),
                hint: current >= target ? "Daily goal complete. Good work!" : `${target - current} more to hit today's goal`,
            },
        });
    }catch (err){
        console.error("GET /home failed:", err)
        res.status(500).json({error: "Failed to load home data"})
    }
});

export default router;