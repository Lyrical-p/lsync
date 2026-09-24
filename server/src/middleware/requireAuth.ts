import { SupabaseClient } from "@supabase/supabase-js";
import { NextFunction, Request, Response } from "express";
import { createUserClient, supabaseAnon } from "../lib/supabase";




export interface AuthRequest extends Request {
    userId?: string;
    userEmail?: string;
    supabase?: SupabaseClient;
}

export async function requireAuth(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null;

    if (!token) {
        return res.status(401).json({error: "Missing Authorization header"});

    }

    const {data, error} = await supabaseAnon.auth.getUser(token);

    if (error || !data.user ){
        return res.status(401).json({error: "Invalid or expired session"})
    }

    req.userId = data.user.id;
    req.userEmail = data.user.email;
    req.supabase = createUserClient(token);
    next();
    
}