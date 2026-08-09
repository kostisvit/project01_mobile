import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import EmailVerifiedScreen from './EmailVerifiedScreen';

type RootStackParamList = {
  Recovery: undefined;
  Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const API_URL = Config.API_URL;

const RecoveryScreen = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');

  const navigation = useNavigation<NavigationProp>();

  const recover = async () => {
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedEmail = email.trim().toLowerCase();

    if (!emailRegex) {
      setError('Παρακαλώ εισάγετε το email σας.');
      return
    }

    if (!emailRegex.test(normalizedEmail)) {
      setError('Παρακαλώ εισάγετε έγκυρο email.');
      return;
    }

    if (!API_URL) {
      setError('Δεν έχει ρυθμιστεί το API URL.');
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API_URL}/auth/password-reset/`, {
        email: emailRegex,
      });

      Alert.alert(
        'Ελέγξτε το email σας',
        'Έχουμε στείλει έναν σύνδεσμο επαναφοράς κωδικού στο email σας.',
        [
          {
            text: 'OK',
            onPress: () => {
              setEmail('');
              navigation.navigate('Login');
            },
          },
        ]
      );
    } catch (err) {
      setError(
        'Σφάλμα κατά την αποστολή του email επαναφοράς κωδικού.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={recover}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Αποστολή Συνδέσμου Επαναφοράς
          </Text>
        )}
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#ff4500',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default RecoveryScreen;