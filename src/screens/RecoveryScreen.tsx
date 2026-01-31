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
  Recovery: undefined;
  Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const API_URL = Config.API_URL;

const RecoveryScreen = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const navigation = useNavigation<NavigationProp>();

  const recover = async () => {
    try {
      await axios.post(`${API_URL}/password-reset/`, {
        email,
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
      setError('Σφάλμα κατά την αποστολή του email επαναφοράς κωδικού.');
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
      <TouchableOpacity style={styles.button} onPress={recover}>
        <Text style={styles.buttonText}>Αποστολή Συνδέσμου Επαναφοράς</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
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