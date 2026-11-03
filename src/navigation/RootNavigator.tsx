import React from 'react';
import { createNativeStackNavigator } from
  '@react-navigation/native-stack';

import BottomTabNavigator from './BottomTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import FeedbackScreen from '../screens/SendFeedbackScreen';
import LocationPermissionScreen from '../screens/LocationPermScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="Feedback"
        component={FeedbackScreen}
      />

      <Stack.Screen
        name='LocationPermission'
        component={LocationPermissionScreen}
      />

      <Stack.Screen
        name="Home"
        component={HomeScreen} />
    </Stack.Navigator>
  );
}
