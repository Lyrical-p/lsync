import { Router } from "express";
import { AuthRequest } from "../middleware/requireAuth";
import { bumpStreak } from "../lib/streak";





const router = Router();

interface TaskRow {
    id: string;
    title: string;
    subtitle: string | null;
    tag: string | null;
    done: boolean;
    subtitle_color: string | null;
    due_date: string | null
}

function mapTask(row: TaskRow) {
    return{
        id: row.id,
        title: row.title,
        subtitle: row.subtitle ?? "",
        tag: row.tag ?? "Normal",
        done: row.done,
        subtitleColor: row.subtitle_color ?? undefined,
        dueDate: row.due_date ?? undefined
    };
}


router.get("/", async (req: AuthRequest, res) => {
    const section = req.query.section as string | undefined;
    let query = req
        .supabase!.from("tasks")
        .select("*")
        .order("created_at", {ascending: true});

    if (section === "today" || section === "upcoming"){
        query = query.eq("section", section);
    }

    const {data, error} = await query;
    if (error) return  res.status(500).json({error: error.message});

    res.json((data ?? []).map(mapTask));

});


router.post("/", async (req: AuthRequest, res) => {
    const {title, subtitle, tag, section, dueDate} = req.body ?? {};

    if (!title || typeof title !== "string") {
        return res.status(400).json({error: "title is required"});
    }

    const {data, error} = await req.supabase!
        .from("tasks")
        .insert({
            user_id: req.userId,
            title,
            subtitle: typeof subtitle === "string" ? subtitle : "",
            tag: typeof tag === "string" ? tag : "Normal",
            section: section === "upcoming" ? "upcoming" : "today",
            due_date: typeof dueDate === "string" ? dueDate : null
        })
        .select()
        .single();

    if (error) return res.status(500).json({error: error.message});
    res.status(201).json(mapTask(data));
});

router.patch("/:id/toggle", async (req: AuthRequest, res) => {
    const {id} = req.params;

    const {data: existing, error: fetchError} = await req.supabase!
        .from("tasks")
        .select("*")
        .eq("id", id)
        .single();

    if (fetchError || !existing) {
        return res.status(404).json({
            error: "Tasks not found"
        });
    }

    const nextDone = !existing.done;

    const { data, error} = await req
        .supabase!.from("tasks")
        .update({
            done: nextDone,
            completed_at: nextDone ? new Date().toISOString() : null,

        })
        .eq("id", id)
        .select()
        .single();

    if (error) return res.status(500).json({error: error.message});

    if (nextDone) {
        await bumpStreak(req.supabase!, req.userId!);
    }

    res.json(mapTask(data));
});

router.delete("/:id", async(req: AuthRequest, res) => {
    const {id} = req.params;

    const {error} = await req.supabase!
     .from("tasks")
     .delete()
     .eq("id", id);

     if (error) return res.status(500).json({error: error.message});

     res.json({ok: true})
})

export default router;





