import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import RecoveryScreen from '../screens/RecoveryScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import LocationPermissionScreen from '../screens/LocationPermScreen';
import FeedbackScreen from '../screens/SendFeedbackScreen';
import AddReviewScreen from '../screens/AddReviewScreen';
import EmailVerifiedScreen from '../screens/EmailVerifiedScreen';

import BottomTabNavigator from './BottomTabNavigator';
import { RootStackParamList } from '../types/navigation';
import { UserProvider } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return null;

  return (
    <UserProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Recovery" component={RecoveryScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="EmailVerified" component={EmailVerifiedScreen} />
        <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />

        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />

        {isAuthenticated && (
          <Stack.Screen name="AddReview" component={AddReviewScreen} />
        )}

        <Stack.Screen name="Feedback" component={FeedbackScreen} />

      </Stack.Navigator>
    </UserProvider>
  );
}
