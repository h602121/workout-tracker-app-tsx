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
import AiAssistant from "../components/AiAssistant";

export default function Main() {
  const [workouts, setWorkouts] = useState<string[]>([]);
  const [value, setValue] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              value={value}
              onChangeText={(text) => setValue(text)}
              placeholder="Workout"
              keyboardType="default"
              autoCapitalize="none"
              textContentType="name"
            ></TextInput>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setWorkouts([...workouts, value])}
            >
              <Text style={styles.textStyle}>Add Exercise</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Close Window</Text>
            </Pressable>
            <Text>{workouts}</Text>
          </View>
        </View>
      </Modal>
      <Pressable
        className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Show Modal</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/login")}>
        <Text>Exit</Text>
      </Pressable>

      <AiAssistant></AiAssistant>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
