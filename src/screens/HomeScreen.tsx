import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScrollableTabs from '../components/ScrollableTabs';
import Config from 'react-native-config';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { logout } from '../api/auth';
import AppHeader from '../components/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';


type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const API_URL = Config.API_URL;

interface User {
  email: string;
  first_name?: string;
  last_name?: string;
}

const HomeScreen = ({ navigation }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Failed to load user:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace('Welcome');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader user={user} loading={loading} />

      <View style={styles.tabSection}>
        <ScrollableTabs apiUrl={`${API_URL}/org-types/`} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ff4500' },
  header: { height: 95, justifyContent: 'center', alignItems: 'center' },
  brand: {
    fontSize: 32,
    fontWeight: '700',
    color: 'ghostwhite',
    letterSpacing: 2,
  },
  userEmail: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
    fontWeight: '500',
  },
  tabSection: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },

  logoutBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  menuBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  menuIcon: {
    fontSize: 26,
    color: '#fff',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  menu: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  menuItem: {
    paddingVertical: 14,
  },
  menuEmail: {
    fontWeight: '600',
    marginBottom: 16,
  },
});

export default HomeScreen;
