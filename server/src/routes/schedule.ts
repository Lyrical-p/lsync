import { Router } from "express";
import { AuthRequest } from "../middleware/requireAuth";




const router = Router();

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HRS = ["7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM",];

router.get("/", async (req: AuthRequest, res) => {
    try{
        const requestedDay = typeof req.query.day === "string" ? req.query.day : null;
        const requestedIndex = requestedDay ? WEEK_DAYS.findIndex (
            (d) => d.toLowerCase() === requestedDay.toLowerCase(),
        ) : -1;

        const dayOfWeek = requestedIndex !== -1 ? requestedIndex : new Date().getDay();

        const {data: slots, error} = await req.supabase!
            .from("timetable_slots")
            .select("*")
            .eq("day_of_week", dayOfWeek)
            .order("hour_index", {ascending: true});
        if (error) return res.status(500).json({error: error.message});

        const rows = slots ?? [];

        const mappedSlots = rows.map((s) => ({
            id: s.id,
            classId: s.class_id,
            name: s.name,
            detail: s.detail ?? "",
            colorKey: s.color_key,
            category: s.category ?? "school"
        }));

        const slotAtHour = HRS.map((_, hourIndex) => {
            const idx = rows.findIndex((s) => s.hour_index === hourIndex);
            return idx === -1 ? null :idx;
        });

        res.json({
            weekDays: WEEK_DAYS,
            timetableHours: HRS,
            slots: mappedSlots,
            slotAtHour
        });
     }catch (err){
        console.error("GET /schedule failed:", err)
        res.status(500).json({error: "Failed to load schedule"})
    }
        
});

export default router

