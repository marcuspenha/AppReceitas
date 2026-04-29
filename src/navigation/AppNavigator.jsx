import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen    from '../screens/LoginScreen';
import HomeScreen     from '../screens/HomeScreen';
import AddItemScreen  from '../screens/AddItemScreen';
import DetailScreen   from '../screens/DetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import colors         from '../constants/colors';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
  headerStyle: { backgroundColor: colors.primary },  // Laranja agora
  headerTintColor: colors.headerText,
  headerTitleStyle: { fontWeight: 'bold' },
}}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // Login sem header
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Minhas Receitas' }}
        />
        <Stack.Screen
          name="AddItem"
          component={AddItemScreen}
          options={{ title: 'Nova Receita' }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ title: 'Detalhes' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Configurações' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}