import { GluestackUIProvider, Text, Box } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config'; // Optional if you want to use default theme
import LoginField from '../components/LoginField';


export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <Box width="100%" justifyContent="center" alignItems="center">
        
        <LoginField></LoginField>
      </Box>
    </GluestackUIProvider>
  );
}
