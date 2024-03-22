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
import { useState } from "react";
import TextInput from "../components/TextInput";
import NavBar from "../components/NavBar";
import UserCard from "../components/UserCard";

export default function AiPage() {
    return (
        <View className="flex-1 bg-white">
            <Text className="text-center">Ai Page</Text>
            <NavBar />
        </View>
    );
}