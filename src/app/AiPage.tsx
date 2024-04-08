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
import { playFromPath } from "../../utils/playFromPath";

Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  staysActiveInBackground: false,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  playThroughEarpieceAndroid: true,
});

export default function AiPage() {
  const [borderColor, setBorderColor] = useState<"gray" | "green">("gray");
  const [urlPath, setUrlPath] = useState("");
  const [responseGPT, setResponseGPT] = useState("");

  const listFiles = async () => {
    try {
      const result = await FileSystem.readAsStringAsync(
        FileSystem.documentDirectory!
      );
      if (result.length > 0) {
        const filename = result[0];
        const path = FileSystem.documentDirectory + filename;
        setUrlPath(path);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const { state, startRecognizer, stopRecognizer, destroyRecognizer } =
    useVoiceRecognition();

  // const handleSubmitAudio = async () => {
  //   console.log(state.results);

  //   if (!state.results[0]) return;

  //   try {
  //     console.log("fetching");
  //     const audioBlob = await fetchAudio(state.results[0]);

  //     const reader = new FileReader();
  //     reader.onload = async (e) => {
  //       if (e.target && typeof e.target.result === "string") {
  //         //File will look something like this. We want the data after base64: data:audio/mpeg;base64,.....(actual base64 data)....
  //         const audioData = e.target.result.split(",")[1];
  //         //save data
  //         const path = await writeAudioToFile(audioData);

  //         //play audio
  //         setUrlPath(path);
  //         await playFromPath(path);
  //         destroyRecognizer();
  //       }
  //     };

  //     reader.readAsDataURL(audioBlob);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const handleSubmit = async () => {
    console.log(state.results);

    if (!state.results[0]) return;

    try {
      console.log("fetching");
      const audioBlob = await fetchAudio(state.results[0]);
      setResponseGPT(audioBlob);
      destroyRecognizer();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <View className="flex-1 bg-white">
      <Text className="text-center">Ai Page</Text>
      <Text>Press button to start recording</Text>
      <View className="flex-1 justify-center items-center">
        <Text>Your message: </Text>
        <Pressable
          className={`rounded-full p-4 border ${
            borderColor === "gray" ? "border-gray-500" : "border-green-500"
          }`}
          onPressIn={() => {
            setBorderColor("green");
            startRecognizer();
            setResponseGPT("");
          }}
          onPressOut={() => {
            setBorderColor("gray");
            stopRecognizer();
            handleSubmit();
          }}
        >
          <Text>Hold to speak</Text>
        </Pressable>
        <Text>{JSON.stringify(state, null, 2)}</Text>

        <Text>{responseGPT}</Text>

        <NavBar />
      </View>
    </View>
  );
}
