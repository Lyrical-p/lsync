import { createClient, SupabaseClient } from "@supabase/supabase-js";



const supabaseUrl = process.env.SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? "";
console.log(supabaseUrl);

if (!supabaseUrl || !supabaseAnonKey){
    console.warn(
    "[lsync-server] SUPABASE_URL or SUPABASE_ANON_KEY is not set. " +
      "Authenticated routes will reject every request until it is " +
      "configured in server/.env"
    );
}

export const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

export function createUserClient(accessToken: string): SupabaseClient{
    return createClient(supabaseUrl, supabaseAnonKey, {
        global: {headers: {Authorization: `Bearer ${accessToken}`}},
        auth: {persistSession: false, autoRefreshToken: false},
    });
}



const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""

if(!supabaseServiceRoleKey){
    console.warn(
        "[lsync-server] SUPABASE_SERVICE_ROLE_KEY is not set." + "Account deletion will fail until it is configured in server/.env"
    )
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey,{
    auth: {persistSession: false, autoRefreshToken: false}
})