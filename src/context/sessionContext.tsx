import {Session} from "@supabase/supabase-js";
import {createContext, useContext, useEffect, useState} from "react";
import {supabase} from "../lib/supabase";

type ContextType ={
    session: Session | null;
    setSession: (session: Session | null) => void;
}

const SessionContext = createContext<ContextType | null>(null);


export default function SessionProvider({children}: {children: React.ReactNode,}) {
    const [session, setSession] = useState<Session | null >(null);
    useEffect(() => {
        // Fetch the session on component mount
        supabase.auth.getSession()
            .then(({ data: { session } }) => {
                setSession(session);
            });

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        // Cleanup listener when the component unmounts
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return (
        <SessionContext.Provider value={{session,setSession}}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSessionContext() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("useSessionContext must be used within a SessionProvider");
    }
    return context;
}