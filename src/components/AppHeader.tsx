import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../api/auth';

interface Props {
  user: any;
  loading: boolean;
}

const AppHeader = ({ user, loading }: Props) => {
  const navigation = useNavigation<any>();
  const [menuVisible, setMenuVisible] = React.useState(false);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.replace('Welcome');
        },
      },
    ]);
  };

  return (
    <>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => setMenuVisible(true)}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <Text style={styles.brand} onPress={() => {
          navigation.navigate('Home');
        }}>NearMe</Text>

        {loading ? (
          <ActivityIndicator color="#fff" style={{ marginTop: 4 }} />
        ) : user ? (
          <Text style={styles.userEmail}>{user.email}</Text>
        ) : (
          <Text style={styles.userEmail}>Περιηγείστε ως επισκέπτης</Text>
        )}
      </View>

      {/* MENU */}
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

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate('Profile');
                  }}
                >
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

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate('Signup');
                  }}
                >
                  <Text style={{ fontWeight: '600' }}>Εγγραφή</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate('Welcome');
                  }}
                >
                  <Text style={{ fontWeight: '600' }}>Πληροφορίες</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  header: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  brand: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ff4500',
    letterSpacing: 2,
  },
  userEmail: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
    fontWeight: '500',
  },
  menuBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  menuIcon: {
    fontSize: 26,
    color: '#ff4500',
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