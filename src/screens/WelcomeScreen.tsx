import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NearMe</Text>
      <Text style={styles.subtitle}>
        Ψάξε · Βρες · Πήγαινε
      </Text>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.loginText}>Συνέχεια ως επισκέπτης</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.signupText}>Είσοδος</Text>
      </TouchableOpacity>

      <Text style={{ marginBottom: 16, color: '#444' }}>ή</Text>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={styles.signupText}>Κάνε Εγγραφή</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#e0f7fa',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#00796b',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '300',
    letterSpacing: 1.2,
    color: '#444',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: '#00796b',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#00796b',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 2,
    width: '100%',
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  signupButton: {
    borderWidth: 1,
    borderColor: '#0d9488',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  registerButton: {
    borderWidth: 1,
    borderColor: '#0d9488',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 8,
    width: '100%',
  },
  signupText: {
    color: '#0d9488',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});