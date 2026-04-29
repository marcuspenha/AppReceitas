import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import colors from './src/constants/colors'; // ← essa linha estava faltando

export default function App() {
  return (
    <>
      <AppNavigator />
      <StatusBar style="light" backgroundColor={colors.primary} />
    </>
  );
}