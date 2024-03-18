import React from 'react';
import { StyleSheet, View } from 'react-native';
import TextInput from '../components/TextInput';
import LoginButton from '../components/LoginButton';

const LoginScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
      <TextInput placeholder="Password" secureTextEntry autoComplete="password" textContentType="password" />
      <LoginButton onPress={() => console.log('Login pressed')}>Login</LoginButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
});

export default LoginScreen;
