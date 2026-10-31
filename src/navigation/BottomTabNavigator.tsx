import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import HomeStackNavigator from './HomeStackNavigator';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ScrollableTabs from '../components/ScrollableTabs';
import LoginScreen from '../screens/LoginScreen';
import { useAuth } from '../context/AuthContext';

import Config from 'react-native-config';

const Tab = createBottomTabNavigator();



const API_URL = Config.API_URL;

export default function BottomTabNavigator() {

    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return null; // replace this with a loading screen
    }
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0F172A',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: 'Αρχική',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title:'Αναζήτηση',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="search" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Favorites"
        options={{
          title: 'Αγαπημένα',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="favorite" size={size} color={color} />
          ),
        }}
      >
        {() => <ScrollableTabs apiUrl={`${API_URL}/org-types`} />}
      </Tab.Screen>

      <Tab.Screen
          name="Profile"
          component={isAuthenticated ? ProfileScreen : LoginScreen}
          options={{
            tabBarLabel: isAuthenticated ? "Profile" : "Login",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons
                name={isAuthenticated ? "person" : "login"}
                size={size}
                color={color}
              />
            ),
          }}
        />
    </Tab.Navigator>
  );
}
