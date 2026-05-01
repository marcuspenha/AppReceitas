import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text } from 'react-native'

import { useAuth } from '../context/AuthContext';
import colors from '../constants/colors';

import LoginScreen    from '../screens/LoginScreen';
import HomeScreen     from '../screens/HomeScreen';
import AddItemScreen  from '../screens/AddItemScreen';
import DetailScreen   from '../screens/DetailScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  // Enquanto verifica sessão, exibe spinner
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',
                     backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle:      { backgroundColor: colors.primary },
          headerTintColor:  colors.headerText,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {user ? (
          // Rotas autenticadas
          <>
           
<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={({ navigation }) => ({
    title: 'Minhas Receitas',
    headerRight: () => (
      <TouchableOpacity
        onPress={() => navigation.navigate('Settings')}
        style={{ marginRight: 12 }}
      >
        <Text style={{ fontSize: 22 }}>⚙️</Text>
      </TouchableOpacity>
    ),
  })}
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
          </>
        ) : (
          // Rota pública
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}