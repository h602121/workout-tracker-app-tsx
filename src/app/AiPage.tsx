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
import { useVoiceRecognition } from "../hooks/useVoiceRecognition";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import fetchAudio from "../../utils/fetchAudio";
import { writeAudioToFile } from "../../utils/writeAudioToFile";

Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  staysActiveInBackground: false,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  playThroughEarpieceAndroid: true,
});

export default function AiPage() {
  const [borderColor, setBorderColor] = useState<"gray" | "green">("gray");
  const { state, startRecognizer, stopRecognizer, destroyRecognizer } =
    useVoiceRecognition();

  const handleSubmit = async () => {
    if (!state.results[0]) return;

    try {
      const audioBlob = await fetchAudio(state.results[0]);

      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target && typeof e.target.result === "string") {
          //File will look something like this. We want the data after base64: data:audio/mpeg;base64,.....(actual base64 data)....
          const audioData = e.target.result.split(",")[1];

          //save data
          const path = await writeAudioToFile(audioData);

          //play audio
        }
      };
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <View className="flex-1 bg-white">
      <Text className="text-center">Ai Page</Text>
      <Text>Press button to start recording</Text>
      <View className="flex-1 justify-center items-center">
        <Text>{JSON.stringify(state, null, 2)}</Text>
        <Pressable
          className={`rounded-full p-4 border ${
            borderColor === "gray" ? "border-gray-500" : "border-green-500"
          }`}
          onPressIn={() => {
            setBorderColor("green");
            startRecognizer();
          }}
          onPressOut={() => {
            setBorderColor("gray");
            stopRecognizer();
            //hansleSubmit()
          }}
        >
          <Text>Hold to speak</Text>
        </Pressable>

        <Text>Your message: </Text>
        <NavBar />
      </View>
    </View>
  );
}
