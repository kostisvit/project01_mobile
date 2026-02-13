// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // <- Here we get setToken from the AuthContext
  const { setToken } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please enter email and password');
    setLoading(true);

    try {
      const { token, user } = await login(email, password);

      // ✅ Save token in context (and AsyncStorage)
      await setToken(token);

      const storedToken = await AsyncStorage.getItem("accessToken");
      console.log("Stored token:", storedToken);

      Alert.alert(
        'Success',
        `Welcome ${user.first_name || user.email}`,
        [{ text: 'OK', onPress: () => navigation.replace('LocationPermission') }]
      );
    } catch (err: any) {
      Alert.alert('Login Failed', err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>NearMe</Text>
      <Text style={styles.subtitle}>
        Ψάξε · Βρες · Πήγαινε
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        autoCorrect={false}
        placeholderTextColor="#888"
      />

      <TextInput
        placeholder="Κωδικός"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        placeholderTextColor="#888"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Είσοδος...' : 'Είσοδος'}
        </Text>
      </TouchableOpacity>

      < Text style={{ color: '#fff' }}>
        Ξεχάσατε τον κωδικό σας;{' '}
        <Text
          style={{ textDecorationLine: 'underline', color: '#ff4500' }}
          onPress={() => navigation.navigate('Recovery')}
        >
          Επαναφορά Κωδικού
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    backgroundColor: '#0F172A',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3, // for Android shadow
  },
  button: {
    backgroundColor: '#ff4500',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#00796b',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 2,
  },
  buttonGoogle: {
    backgroundColor: '#4285F4',
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonApple: {
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#ff4500',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '300',
    letterSpacing: 1.2,
    color: '#fff',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
});
