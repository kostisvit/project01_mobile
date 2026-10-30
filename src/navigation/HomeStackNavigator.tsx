import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import OrgDetails from '../screens/OrgDetailsScreen';
import OrgImagesScreen from '../screens/OrgImagesScreen';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="OrgDetail" component={OrgDetails} />
      <Stack.Screen name="OrgPhotos" component={OrgImagesScreen} />
    </Stack.Navigator>
  );
}
