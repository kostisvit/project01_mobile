import React, { useEffect, useState } from 'react';
import { View, StyleSheet, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScrollableTabs from '../components/ScrollableTabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import DefaultLayout from '../layout/DefaultLayout';
import { User } from '../types/user';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;


const HomeScreen = ({ navigation }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
      <View style={styles.container}>
        <ScrollableTabs  />
      </View>
    </DefaultLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginBottom: 0,
    paddingBottom: 0,
  },
});

export default HomeScreen;
