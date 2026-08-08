import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import { RootStackParamList } from '../types/navigation';
import WelcomeScreen from '../screens/WelcomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OrgDetails from '../screens/OrgDetailsScreen';
import RecoveryScreen from '../screens/RecoveryScreen';
import ScrollableTabs from '../components/ScrollableTabs';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import LocationPermissionScreen from '../screens/LocationPermScreen';
import AddReviewScreen from '../screens/AddReviewScreen';
import FeedbackScreen from '../screens/SendFeedbackScreen';
import EmailVerifiedScreen from '../screens/EmailVerifiedScreen';
import Config from 'react-native-config';
import { UserProvider } from '../context/UserContext';
import SearchScreen from '../screens/SearchScreen';
import OrgImagesScreen from '../screens/OrgImagesScreen';
import { useAuth } from '../context/AuthContext';

const API_URL = Config.API_URL;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <UserProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* Public screens */}
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
          name="Recovery"
          component={RecoveryScreen}
        />

        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
        />

        <Stack.Screen
          name="EmailVerified"
          component={EmailVerifiedScreen}
        />

        {/* Available to BOTH guests and logged-in users */}
        <Stack.Screen
          name="LocationPermission"
          component={LocationPermissionScreen}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />

        <Stack.Screen
          name="OrgDetail"
          component={OrgDetails}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
        />
        <Stack.Screen
          name="Feedback"
          component={FeedbackScreen}
        />
        <Stack.Screen
          name="Tabs"
          options={{ title: 'Categories' }}
        >
          {() => (
            <ScrollableTabs
              apiUrl={`${API_URL}/org-types`}
            />
          )}
        </Stack.Screen>

        {/* Logged-in functionality */}
        {isAuthenticated && (
          <>
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
            />

            <Stack.Screen
              name="OrgDetail"
              component={OrgDetails}
            />

            <Stack.Screen
              name="AddReview"
              component={AddReviewScreen}
            />

            <Stack.Screen
              name="Feedback"
              component={FeedbackScreen}
            />

            <Stack.Screen
              name="OrgPhotos"
              component={OrgImagesScreen}
            />
          </>
        )}

      </Stack.Navigator>
    </UserProvider>
  );
}