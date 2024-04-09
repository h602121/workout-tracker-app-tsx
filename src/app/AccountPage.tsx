import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { supabase } from '../lib/supabase'; // Ensure this is the correct import path
import NavBar from "../components/NavBar";
import Account from "../components/Account";
import { Session } from "@supabase/supabase-js";

export default function AccountPage() {
    const [session, setSession] = useState<Session | null>(null);

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
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {/* Pass the session state to the Account component */}
            <Account session={session} />
            <NavBar />
        </View>
    );
}
