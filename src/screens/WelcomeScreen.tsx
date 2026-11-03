
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1120" />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoIcon}>⌖</Text>
        </View>

        <Text style={styles.title}>
          Near<Text style={styles.titleAccent}>Me</Text>
        </Text>

        <Text style={styles.subtitle}>
          Ανακάλυψε ό,τι βρίσκεται κοντά σου.
        </Text>
      </View>

      {/* Welcome message */}
      <View style={styles.messageContainer}>
        <Text style={styles.heading}>
          Ο κόσμος γύρω σου,{"\n"}
          <Text style={styles.headingAccent}>ένα βήμα μακριά.</Text>
        </Text>

        <Text style={styles.description}>
          Βρες καταστήματα, υπηρεσίες και ενδιαφέροντα
          μέρη κοντά σου εύκολα και γρήγορα.
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('LocationPermission')}
        >
          <Text style={styles.primaryButtonText}>
            Συνέχεια ως επισκέπτης
          </Text>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.secondaryButtonText}>
            Είσοδος
          </Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>ή</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity
          style={styles.registerButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.registerText}>
            Δημιουργία λογαριασμού
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Ανακάλυψε περισσότερα. Ζήσε περισσότερα.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1120',
    paddingHorizontal: 28,
    justifyContent: 'center',
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 55,
  },

  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: 'rgba(255,69,0,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,69,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  logoIcon: {
    color: '#FF5722',
    fontSize: 48,
    fontWeight: '300',
  },

  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
  },

  titleAccent: {
    color: '#FF5722',
  },

  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 10,
    letterSpacing: 0.4,
  },

  messageContainer: {
    marginBottom: 38,
  },

  heading: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: '800',
    lineHeight: 39,
    letterSpacing: -0.6,
    textAlign: 'center',
  },

  headingAccent: {
    color: '#FF5722',
  },

  description: {
    color: '#94A3B8',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 8,
  },

  actionsContainer: {
    width: '100%',
  },

  primaryButton: {
    height: 58,
    backgroundColor: '#FF5722',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    elevation: 5,
    shadowColor: '#FF5722',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  buttonArrow: {
    color: '#FFFFFF',
    fontSize: 22,
    position: 'absolute',
    right: 20,
  },

  secondaryButton: {
    height: 56,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151F32',
  },

  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 23,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#334155',
  },

  dividerText: {
    color: '#64748B',
    marginHorizontal: 16,
    fontSize: 13,
  },

  registerButton: {
    height: 56,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'center',
  },

  registerText: {
    color: '#FF5722',
    fontSize: 16,
    fontWeight: '700',
  },

  footer: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 45,
    letterSpacing: 0.3,
  },
});

export default WelcomeScreen;
