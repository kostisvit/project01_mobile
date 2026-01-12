import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScrollableTabs from '../components/ScrollableTabs';
import Config from 'react-native-config';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { logout } from '../api/auth';


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
      {/* Header */}
      <View style={styles.header}>
        {/* Logout button */}
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => setMenuVisible(true)}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <Text style={styles.brand}>NearMe</Text>

        {/* Display user email below brand */}
        {loading ? (
          <ActivityIndicator color="#fff" style={{ marginTop: 4 }} />
        ) : user ? (
          <Text style={styles.userEmail}>{user.email}</Text>
        ) : (
          <Text style={styles.userEmail}>Περιηγείστε ως επισκέπτης</Text>
        )}
      </View>
      <Modal
        transparent
        animationType="slide"
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menu}>
            {user ? (
              <>
                <Text style={styles.menuEmail}>{user.email}</Text>

                <TouchableOpacity style={styles.menuItem}>
                  <Text>Προφίλ Χρήστη</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                  <Text>Ρυθμίσεις</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleLogout}
                >
                  <Text style={{ color: 'red', fontWeight: '600' }}>
                    Έξοδος
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>


                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate('Login');
                  }}
                >
                  <Text style={{ fontWeight: '600' }}>Είσοδος</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                  <Text>Πληροφορίες</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
      {/* Tab Section */}
      <View style={styles.tabSection}>
        <ScrollableTabs apiUrl={`${API_URL}/org-types/`} />
      </View>

      {/* Other content */}
      {/* <View style={styles.content}>
        <Text>Other content here</Text>
      </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#34d399' },
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
