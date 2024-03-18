import { GluestackUIProvider, Text, Box } from '@gluestack-ui/themed';
import { StyleSheet, View } from 'react-native';
import { config } from '@gluestack-ui/config'; // Optional if you want to use default theme
import LoginScreen from './src/screens/LoginScreen';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <LoginScreen />
    </View>
  );
}
