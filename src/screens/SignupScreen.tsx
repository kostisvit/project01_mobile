import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert
} from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Register: undefined;
  Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const API_URL = Config.API_URL;

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');

  const navigation = useNavigation<NavigationProp>();

  const register = async () => {
    // 🔴 validation
    if (password !== repeatPassword) {
      setError('Οι κωδικοί δεν ταιριάζουν');
      return;
    }

    if (password.length < 8) {
      setError('Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες');
      return;
    }

    setError('');

    try {
      const response = await axios.post(`${API_URL}/register/`, {
        email,
        password,
      });

      Alert.alert(
        'Success',
        'Registered successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              setEmail('');
              setPassword('');
              setRepeatPassword('');
              setError('');
              navigation.navigate('Login')
            },
          },
        ]
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        Alert.alert(
          'Error',
          error.response?.data?.message || 'Something went wrong'
        );
      } else if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'Something went wrong');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Δημιουργία λογαριασμού</Text>

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

      <TextInput
        placeholder="Επνάληψη Κωδικού"
        value={repeatPassword}
        onChangeText={setRepeatPassword}
        style={styles.input}
        secureTextEntry
        placeholderTextColor="#888"
      />

      {/* Error message */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={register}>
        <Text style={styles.buttonText}>Εγγραφή</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>
        Έχετε λογαριασμό;{' '}
        <Text
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          Είσοδος
        </Text>
      </Text>
    </View>
  );
};
export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#00796b',
    textAlign: 'center',
    marginVertical: 20,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#00796b',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#00796b',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
  loginText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
  },
  loginLink: {
    color: '#00796b',
    fontWeight: '500',
  },
});