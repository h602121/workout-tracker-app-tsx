import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  BackHandler,
} from "react-native";
import TextInput from "../components/TextInput";
import LoginButton from "../components/LoginButton";
import { router, useNavigation } from "expo-router";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  function changeEmail(email: string) {
    setEmail(email);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text>{email}</Text>
        <TextInput
          value={email}
          onChangeText={changeEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          autoComplete="password"
          textContentType="password"
        />
        <LoginButton onPress={() => router.push("/main")}>Login</LoginButton>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
});

export default LoginScreen;
