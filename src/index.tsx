import { GluestackUIProvider, Text, Box } from '@gluestack-ui/themed';
import { StyleSheet, View } from 'react-native';
import { config } from '@gluestack-ui/config'; // Optional if you want to use default theme
<<<<<<< HEAD
import LoginScreen from './app/login';
=======
import LoginScreen from './screens/LoginScreen';
>>>>>>> 3341bad474edcb25f4db2175cc17d97a80af4ca7

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <LoginScreen />
    </View>
  );
}
