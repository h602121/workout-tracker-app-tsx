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
import tw from "tailwind-react-native-classnames";
import { useVoiceRecognition } from "../../hooks/useVoiceRecognition";

export default function AiPage() {
  const [borderColor, setBorderColor] = useState("gray");
  const { state, startRecognizing, stopRecognizing, destroyRecognizer } =
    useVoiceRecognition();
  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <Text className="text-center">Ai Page</Text>
      <Text>Press and hold this button to start recording</Text>
      <Text>{JSON.stringify(state, null, 2)}</Text>
      <Text>Your message:</Text>

      <Pressable
        style={tw`rounded-full p-4 border border-${borderColor}-500`}
        onPressIn={() => setBorderColor("green")}
        onPressOut={() => setBorderColor("gray")}
      >
        <Text>Hold to Speak</Text>
      </Pressable>
      <Button title="Replay last message" onPress={() => {}}></Button>

      <NavBar />
    </View>
  );
}
