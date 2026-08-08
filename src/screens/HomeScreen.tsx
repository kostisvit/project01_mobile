import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScrollableTabs from '../components/ScrollableTabs';
import Config from 'react-native-config';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
//import { logout } from '../api/auth';
import DefaultLayout from '../layout/DefaultLayout';
import { User } from '../types/user';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const API_URL = Config.API_URL;




const HomeScreen = ({ navigation }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  //const [menuVisible, setMenuVisible] = useState(false);

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

  return (
    <DefaultLayout user={user} loading={loading}>
      <View style={styles.tabSection}>
        <ScrollableTabs apiUrl={`${API_URL}api/org-types/`} />
      </View>
    </DefaultLayout>
  );
};

const styles = StyleSheet.create({

  tabSection: { flex: 1 },

});

export default HomeScreen;
