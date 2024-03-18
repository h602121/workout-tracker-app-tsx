import React from 'react';
import { StyleSheet, TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

const LoginButton: React.FC<TouchableOpacityProps> = ({ children, ...rest }) => {
  return (
    <TouchableOpacity style={styles.loginButton} {...rest}>
      <Text style={styles.loginButtonText}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: '#007bff',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default LoginButton;
