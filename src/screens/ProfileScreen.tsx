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
import { ScrollView } from "react-native-gesture-handler";

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

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Προφίλ χρήστη</Text>

        {/* PROFILE CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>Όνομα</Text>
          <TextInput
            value={profile.first_name}
            style={styles.input}
            placeholderTextColor="#9ca3af"
            onChangeText={(v) => handleChange("first_name", v)}
          />

          <Text style={styles.label}>Επώνυμο</Text>
          <TextInput
            value={profile.last_name}
            style={styles.input}
            placeholderTextColor="#9ca3af"
            onChangeText={(v) => handleChange("last_name", v)}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={profile.email}
            style={[styles.input, { backgroundColor: "#f3f4f6" }]}
            editable={false}
          />

          <Text style={styles.label}>Τηλέφωνο</Text>
          <TextInput
            value={profile.phone}
            style={styles.input}
            placeholderTextColor="#9ca3af"
            keyboardType="phone-pad"
            onChangeText={(v) => handleChange("phone", v)}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Αποθήκευση</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonDelete}>
          <Text style={styles.buttonText}>Διαγραφή λογαριασμού</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ff4500",
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  label: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  button: {
    backgroundColor: "#ff4500",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },

  buttonDelete: {
    backgroundColor: "#ef4444",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default ProfileScreen