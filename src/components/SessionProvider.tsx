// SessionContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {Session} from "@supabase/supabase-js"; // Adjust the import path to your Supabase client instance

// Define the shape of your context state
interface SessionContextType {
    session: Session;
    setSession: (session: Session | null) => void;
}

// Provide a default value matching the shape of SessionContextType
const defaultValue: SessionContextType = {
    session: supabase.auth.session(),
    setSession: () => {}, // Placeholder function
};

// Create the context with the default value
const SessionContext = createContext<SessionContextType>(defaultValue);

// Provider component
export const SessionProvider = ({ children }) => {
    const [session, setSession] = useState();

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
        <SessionContext.Provider value={{ session, setSession }}>
            {children}
        </SessionContext.Provider>
    );
};

// Custom hook to use the session context
export const useSession = () => useContext(SessionContext);
