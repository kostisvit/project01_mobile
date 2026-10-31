import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { AuthProvider } from "./src/context/AuthContext";
import RootNavigator from './src/navigation/RootNavigator';

enableScreens();

const linking = {
  prefixes: ["nearme://"],
  config: {
    screens: {
      EmailVerified: "email-verified",
      ResetPassword: "reset-password/:uid/:token",
    },
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer linking={linking}>
        <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
