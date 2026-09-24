import { Router } from "express";
import { AuthRequest } from "../middleware/requireAuth";




const router = Router()

router.post("/", async ( req: AuthRequest, res) => {
    try{
        const {name, time, color, dayOfWeek, hourIndex, category} = req.body ?? {};

        if(!name || typeof name !== "string"){
            return res.status(400).json({error: "name is required"});
        }
        if (!time || typeof time !== "string"){
            return res.status(400).json({error: "time is required"})
        }
        if (typeof dayOfWeek !== "number" || dayOfWeek < 0 || dayOfWeek > 6){
            return res.status(400).json({error: "dayOfWeek must be 0 - 6"})
        }
        if (typeof hourIndex !== "number" || hourIndex < 0){
            return res.status(400).json({error: "hourIndex is required"})
        }


        const resolvedCat = category === "personal" ? "personal" : "school"
        const resolvedCol = typeof color === "string" ? color : resolvedCat === "personal" 
        ? "#22c5ee" : "#210675"


        const {data, error} = await req.supabase!
            .from("classes")
            .insert({
                user_id: req.userId,
                name, time,
                color: resolvedCol,
                day_of_week: dayOfWeek,
                category: resolvedCat
            })
            .select()
            .single()

        if (error) return res.status(500).json({error: error.message})


        const {error: slotError} = await req.supabase!.from("timetable_slots").insert({
            user_id: req.userId,
            class_id: data.id,
            day_of_week: dayOfWeek,
            hour_index: hourIndex,
            name,
            detail: "",
            color_key: resolvedCat === "personal" ? "purple" : "blue",
            category: resolvedCat
        })

        if (slotError){
            await req.supabase!.from("classes").delete().eq("id", data.id)
            return res.status(500).json({error: slotError.message});
        }


        res.status(201).json({
            id: data.id,
            name: data.name,
            meta: data.meta ?? "",
            time: data.time,
            color: data.color,
            dayOfWeek: data.day_of_week,
            category: data.category
        })
     }catch (err){
        console.error("POST /class failed:", err)
        res.status(500).json({error: "Failed to load class"})
    }

})

    router.delete("/:id", async (req: AuthRequest, res) => {
    try{
        const {id} = req.params;

        const {error} = await req.supabase!
        .from("classes")
        .delete()
        .eq("id", id)
        
        if (error) return res.status(500).json({error: error.message});

        res.json({ok:true})
     }catch (err){
        console.error("DELETE /class failed:", err)
        res.status(500).json({error: "Failed to delete class"})
    }
})

export default router