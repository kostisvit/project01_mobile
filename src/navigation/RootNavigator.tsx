import React from 'react';
import { createNativeStackNavigator } from
  '@react-navigation/native-stack';

import BottomTabNavigator from './BottomTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import FeedbackScreen from '../screens/SendFeedbackScreen';
import LocationPermissionScreen from '../screens/LocationPermScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import { RootStackParamList } from '../types/navigation';
import SignupScreen from '../screens/SignupScreen'

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
      />

      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="Signup"
        component={SignupScreen}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
      />

      <Stack.Screen
        name="Feedback"
        component={FeedbackScreen}
      />

      <Stack.Screen
        name='LocationPermission'
        component={LocationPermissionScreen}
      />

      {/* <Stack.Screen
        name="Home"
        component={HomeScreen} /> */}
    </Stack.Navigator>
  );
}
