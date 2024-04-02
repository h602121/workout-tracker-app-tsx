import React, {useEffect, useState} from 'react';
import { TouchableWithoutFeedback, Keyboard, View } from 'react-native';
import LoginAuth from '../components/LoginAuth';
import {Session} from "@supabase/supabase-js";
import {supabase} from "../lib/supabase";
import {router} from "expo-router";
import Account from "../components/Account"; // Ensure the path to LoginAuth is correct

const LoginScreen: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])

  return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View className="flex-1 bg-white">
          <LoginAuth session={session}/>
        </View>
      </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
