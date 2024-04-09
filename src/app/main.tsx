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
import SessionProvider, {useSessionContext} from "../context/sessionContext";

export default function Main() {
  return (

    <View className="flex-1 bg-white">
      <UserCard/>
      <HomeDashboards />
      <NavBar />
    </View>

  );
}
