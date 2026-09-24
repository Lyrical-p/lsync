import { Router } from "express";
import { AuthRequest } from "../middleware/requireAuth";
import { supabaseAdmin } from "../lib/supabase";




const router = Router()

router.delete("/", async(req: AuthRequest, res) => {
    try{
        const userId = req.userId!
        
        const {error} = await supabaseAdmin.auth.admin.deleteUser(userId)

        if (error) {
            return res.status(500).json({error: error.message})
        }
        res.json({ok: true})
    }catch (err){
        console.error("DELETE /account failed:", err)
        res.status(500).json({error: "Failed to delete account"})
    }
});

export default router