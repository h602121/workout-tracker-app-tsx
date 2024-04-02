import {
  StyleSheet,
  View,
  Text,
  BackHandler,
  Button,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { router, useNavigation } from "expo-router";
import LoginButton from "../components/LoginButton";
import {useEffect, useState} from "react";
import TextInput from "../components/TextInput";
import NavBar from "../components/NavBar";
import UserCard from "../components/UserCard";
import HomeDashboards from "../components/HomeDashboards";
import {Session} from "@supabase/supabase-js";
import {supabase} from "../lib/supabase";

export default function Main() {
    const [session, setSession] = useState<Session | null>(null);
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])

  return (
    <View className="flex-1 bg-white">
      <UserCard session={session}/>
      <HomeDashboards />
      <NavBar />
    </View>
  );
}


