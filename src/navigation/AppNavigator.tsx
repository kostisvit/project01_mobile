// src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import { RootStackParamList } from '../types/navigation';
import WelcomeScreen from '../screens/WelcomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OrgDetails from '../screens/OrgDetailsScreen';
import ScrollableTabs from '../components/ScrollableTabs';
import Config from 'react-native-config';

const API_URL = Config.API_URL;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="OrgDetail" component={OrgDetails} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Tabs"
        options={{ title: 'Categories' }}
      >
        {() => <ScrollableTabs apiUrl={'${API_URL}/org-types'} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}