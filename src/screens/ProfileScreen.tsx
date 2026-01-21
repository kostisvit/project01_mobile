import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import { getProfile, updateProfile } from "../api/user";
import { UserProfile } from "../types/user";

const ProfileScreen: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = <K extends keyof UserProfile>(
    key: K,
    value: UserProfile[K]
  ) => {
    if (!profile) return;
    setProfile({ ...profile, [key]: value });
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      const updated = await updateProfile({
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone: profile.phone,
      });
      setProfile(updated);
      Alert.alert("Success", "Profile updated");
    } catch (error) {
      Alert.alert("Error", "Update failed");
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!profile) return null;

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader user={profile} loading={loading} />

      <View style={styles.profile_container}>
        <Text style={styles.header}>Προφίλ χρήστη</Text>

        <TextInput
          value={profile.first_name}
          style={styles.input}
          placeholder="First name"
          onChangeText={(v) => handleChange("first_name", v)}
        />

        <TextInput
          value={profile.last_name}
          style={styles.input}
          placeholder="Last name"
          onChangeText={(v) => handleChange("last_name", v)}
        />

        <TextInput
          placeholder="Email"
          value={profile.email}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
          placeholderTextColor="#888"
        />

        <TextInput
          value={profile.phone}
          style={styles.input}
          placeholder="Phone"
          keyboardType="phone-pad"
          onChangeText={(v) => handleChange("phone", v)}
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Αποθήκευση</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#34d399" },
  profile_container: {
    flex: 1,
    backgroundColor: "#e0f7fa",
    padding: 16,
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
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#ddd',
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3, // for Android shadow
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
});

export default ProfileScreen