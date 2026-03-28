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
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useAuth } from '../context/AuthContext';

interface Props {
  user: any;
  loading: boolean;
}


const AppHeader = ({ loading }: { loading: boolean }) => {
  const navigation = useNavigation<any>();
  const [menuVisible, setMenuVisible] = React.useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert('Αποσύνδεση!', 'Είστε σίγουρος/η;', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          setMenuVisible(false);
          navigation.replace('Welcome');
        },
      },
    ]);
  };

  const displayName =
    user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : user?.email;

  return (
    <>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => navigation.navigate('Search')}
        >
          <MaterialIcons name="search" size={26} color="#fff" />
        </TouchableOpacity>

        <Text
          style={styles.brand}
          onPress={() => navigation.navigate('Home')}
        >
          NearMe
        </Text>

        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => setMenuVisible(true)}
        >
          <MaterialIcons name="menu" size={28} color="#fff" />
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : user ? (
          <View>
            <Text style={styles.welcomeText}>Καλώς ήρθες</Text>
            <Text style={styles.userCred} numberOfLines={1}>
              {displayName}
            </Text>
          </View>
        ) : (
          <Text style={styles.userCred} numberOfLines={1}>
            Περιηγείστε ως επισκέπτης
          </Text>
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
                  onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate('Feedback');
                  }}
                >
                  <Text>Στείλτε μας την γνώμη σας</Text>
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
                    navigation.navigate('Feedback');
                  }}
                >
                  <Text style={{ fontWeight: '600' }}>
                    Στείλτε μας την γνώμη σας
                  </Text>
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
  searchBtn: {
    position: 'absolute',
    left: 16,
    top: 16,
  },
  brand: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ff4500',
    letterSpacing: 2,
  },
  welcomeText: {
    color: "#9ca3af",
    fontSize: 12,
  },

  userCred: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    maxWidth: 200,
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