import React from 'react';
import { StyleSheet, TextInput as RNTextInput, TextInputProps } from 'react-native';

interface Props extends TextInputProps {
  placeholder: string;
}

const TextInput: React.FC<Props> = ({ placeholder, ...rest }) => {
  return <RNTextInput style={styles.input} placeholder={placeholder} {...rest} />;
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default TextInput;
