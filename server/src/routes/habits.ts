import { Router } from "express";
import { AuthRequest } from "../middleware/requireAuth";
import { bumpStreak } from "../lib/streak";




const router = Router();

function last7Dates(): string[] {
    const dates: string[] = [];
    for (let i = 6; i >= 0; i -= 1){
        dates.push(new Date(Date.now() - i*86400000).toISOString().slice(0, 10));    
    }
    return dates;
}


router.get("/", async (req: AuthRequest, res) => {
    try{
        const {data: habits, error} = await req .supabase!
            .from("habits")
            .select("*")
            .order("created_at", {ascending: true});
        if (error) return res.status(500).json({error: error.message});

        const {data: logs, error: logsError} = await req .supabase!
            .from("habit_logs")
            .select("habit_id, log_date");
        if (logsError) return res.status(500).json({error: logsError.message})

        const dates = last7Dates();
        const today = dates[dates.length - 1];

        const result = (habits ?? []).map((h) => {
            const habitLogDates = new Set(
                (logs ?? [])
                .filter((l) => l.habit_id === h.id)
                .map((l) => l.log_date as string),
            );
            return {
                id: h.id,
                name: h.name,
                description: h.description ?? "",
                colorKey: h.color_key,
                doneToday: habitLogDates.has(today),
                week: dates.map((d) => habitLogDates.has(d)),
            };
        });

        res.json(result);
     }catch (err){
        console.error("GET /habits failed:", err)
        res.status(500).json({error: "Failed to load habits"})
    }
});


router.post("/", async (req: AuthRequest, res) => {
    try{
        const{name, description, colorKey} = req.body ?? {}

        if(!name || typeof name !== "string"){
            return res.status(400).json({error: "name is required"})
        }

        const {data, error} = await req.supabase!
            .from ("habits")
            .insert({
                user_id: req.userId,
                name,
                description: typeof description === "string" ? description : "",
                color_key: typeof colorKey === "string" ? colorKey : ""
            })
            .select()
            .single();
        
        if (error) return res.status(500).json({error:error.message});
        
        res.status(201).json({
            id: data.id,
            name: data.name,
            description: data.description ?? "",
            colorkey: data.color_key,
            doneToday: false,
            week: [false, false, false, false, false, false, false]
        })

    }catch (err){
        console.error("POST /habits failed:", err)
        res.status(500).json({error: "Failed to create habit"})
    }
});



router.patch("/:id/toggle", async (req: AuthRequest, res) => {
    try{
        const {id} = req.params;
        const today = new Date().toISOString().slice(0, 10);

        const {data: existingLog} = await req .supabase!
            .from("habit_logs")
            .select("id")
            .eq("habit_id", id)
            .eq("log_date", today)
            .maybeSingle();

        if (existingLog) {
            await req.supabase!.from("habit_logs").delete().eq("id", existingLog.id);
        } else{
            const {error: insertError} = await req.supabase!.from("habit_logs").upsert(
                {habit_id: id, user_id: req.userId, log_date: today},
                {onConflict: "habit_id, log_date"}
            );
            if (!insertError) {
                await bumpStreak(req.supabase!, req.userId!);
            }
        }

        const {data: habit, error} = await req.supabase!
            .from("habits")
            .select("*")
            .eq("id", id)
            .single();
        if (error || !habit){
            return res.status(404).json({error: "Habit not found"});
        }

        const dates = last7Dates();
        const {data: logs} = await req.supabase!
            .from("habit_logs")
            .select("log_date")
            .eq("habit_id", id);
        const logDates = new Set((logs ?? []).map((l) => l.log_date as string));

        res.json({
            id: habit.id,
            name: habit.name,
            description: habit.description ?? "",
            colorKey: habit.color_key,
            doneToday: logDates.has(today),
            week: dates.map((d) => logDates.has(d)),
        });
     }catch (err){
        console.error("GET /habits failed:", err)
        res.status(500).json({error: "Failed to toggle habits"})
    }
});

export default router;
