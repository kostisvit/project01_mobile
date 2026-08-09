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

    const getPasswordError = (message: string): string => {
      const lowerMessage = message.toLowerCase();

      if (
        lowerMessage.includes('too short') ||
        lowerMessage.includes('at least 8')
      ) {
        return 'Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες.';
      }

      if (lowerMessage.includes('too common')) {
        return 'Ο κωδικός είναι πολύ συνηθισμένος. Επιλέξτε έναν πιο ασφαλή κωδικό.';
      }

      if (lowerMessage.includes('entirely numeric')) {
        return 'Ο κωδικός δεν μπορεί να αποτελείται μόνο από αριθμούς.';
      }

      if (lowerMessage.includes('too similar')) {
        return 'Ο κωδικός είναι πολύ παρόμοιος με τα προσωπικά σας στοιχεία.';
      }

      return 'Ο κωδικός δεν πληροί τις απαιτήσεις ασφαλείας.';
    };



    const normalizedEmail = email.trim().toLowerCase();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!normalizedEmail) {
      setError('Παρακαλώ εισάγετε το email σας');
      return;
    }

    if (!emailRegex.test(normalizedEmail)) {
      setError('Παρακαλώ εισάγετε ένα έγκυρο email');
      return;
    }

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
      await axios.post(`${API_URL}auth/register/`, {
        email: normalizedEmail,
        password,
      });

      Alert.alert(
        'Η εγγραφή σας ολοκληρώθηκε με επιτυχία',
        'Για να ολοκληρώσετε τη διαδικασία εγγραφής, παρακαλούμε ελέγξτε το email σας και κάντε κλικ στον σύνδεσμο επιβεβαίωσης που σας στείλαμε.',
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
        if (__DEV__) {
          console.log('FULL ERROR:', error.response?.data);
        }

        const data = error.response?.data;

        // Django password validation error
        if (data?.password) {
          const message = Array.isArray(data.password)
            ? data.password[0]
            : data.password;

          setError(getPasswordError(String(message)));
          return;
        }

        // Django email validation error
        if (data?.email) {
          const message = Array.isArray(data.email)
            ? data.email[0]
            : data.email;

          setError(String(message));
          return;
        }

        // Generic backend message
        Alert.alert(
          'Σφάλμα',
          data?.message || 'Κάτι πήγε στραβά. Προσπαθήστε ξανά.'
        );
      } else if (error instanceof Error) {
        if (__DEV__) {
          console.log('ERROR:', error.message);
        }

        Alert.alert('Σφάλμα', 'Παρουσιάστηκε πρόβλημα.');
      } else {
        Alert.alert('Σφάλμα', 'Κάτι πήγε στραβά.');
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
        placeholder="Επανάληψη Κωδικού"
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
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ff4500',
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
    backgroundColor: '#ff4500',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#ff4500',
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
    color: '#ff4500',
    fontWeight: '500',
  },
});