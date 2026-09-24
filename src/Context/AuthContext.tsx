import { Session, User } from "@supabase/supabase-js"
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";





type AuthContextType = {
    session: Session | null;
    user: User | null;
    initializing: boolean;
    signIn: (
        email: string,
        password: string,
    ) => Promise<{error: string | null }>;
    signUp:(
        email: string,
        password: string,
        fullName: string,
    ) => Promise<{error: string | null; needsEmailConfirmation: boolean}>;
    signOut: () => Promise<void>;
    changePassword: (newPassword: string)=>Promise<{error: string | null}>
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    initializing: true,
    signIn: async () => ({error: "Auth not ready"}),
    signUp: async () => ({error: "Auth not ready", needsEmailConfirmation: false}),
    signOut: async () => {},
    changePassword: async () => ({error: "Auth not ready"})

});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({children}: {children: ReactNode}) => {
    const [session, setSession] = useState<Session | null>(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({data}) => {
            setSession(data.session);
            setInitializing(false);
        });

        const {data : listener} = supabase.auth.onAuthStateChange(
            (_event, newSession) => {
                setSession(newSession);
            },
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
           console.log("Attempting login with:", JSON.stringify(email), JSON.stringify(password));
        const {error} = await supabase.auth.signInWithPassword({
            email, password,
        });
        return {error: error ? error.message : null};
        
    };

    const signUp = async (email: string, password: string, fullName: string,) => {
        const {data, error} = await supabase.auth.signUp({
            email, password,
            options: {data:{full_name: fullName}},
        });
        if (error) return {error: error.message, needsEmailConfirmation: false};
        const needsEmailConfirmation = !data.session;
        return {error: null, needsEmailConfirmation};
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const changePassword = async (newPassword: string) => {
        const {error} = await supabase.auth.updateUser({password: newPassword})
        return {error: error ? error.message : null}
    }

    return (
        <AuthContext.Provider
            value={{
                session, 
                user: session?.user ?? null,
                initializing,
                signIn,
                signUp,
                signOut,
                changePassword
            }}>
                {children}
        </AuthContext.Provider>
    )
}


export default AuthProvider
