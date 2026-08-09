import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "../components/AppHeader";
import { getProfile, updateProfile } from "../api/user";
import { UserProfile } from "../types/user";

const ProfileScreen: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const data = await getProfile();

      setProfile({
        ...data,
        phone: data.phone ?? "",
      });
    } catch (error) {
      console.error("Failed to load profile:", error);
      Alert.alert("Σφάλμα", "Αποτυχία φόρτωσης προφίλ.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = <K extends keyof UserProfile>(
    key: K,
    value: UserProfile[K]
  ) => {
    if (!profile) return;

    setProfile((currentProfile) =>
      currentProfile
        ? {
          ...currentProfile,
          [key]: value,
        }
        : null
    );
  };

  const handleSave = async () => {
    if (!profile || saving) return;

    try {
      setSaving(true);

      const updated = await updateProfile({
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone: profile.phone,
      });

      setProfile({
        ...updated,
        phone: updated.phone ?? "",
      });

      Alert.alert("Επιτυχία", "Το προφίλ ενημερώθηκε επιτυχώς.");
    } catch (error) {
      console.error("Profile update failed:", error);
      Alert.alert("Σφάλμα", "Η ενημέρωση του προφίλ απέτυχε.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Διαγραφή λογαριασμού",
      "Είσαι σίγουρος ότι θέλεις να διαγράψεις τον λογαριασμό σου; Η ενέργεια αυτή δεν μπορεί να αναιρεθεί.",
      [
        {
          text: "Ακύρωση",
          style: "cancel",
        },
        {
          text: "Διαγραφή",
          style: "destructive",
          onPress: async () => {
            // TODO:
            // await deleteProfile();
            // await logout();
            // navigation.replace("Login");
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff4500" />
        <Text style={styles.loadingText}>Φόρτωση προφίλ...</Text>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>
          Δεν ήταν δυνατή η φόρτωση του προφίλ.
        </Text>

        <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
          <Text style={styles.buttonText}>Δοκιμή ξανά</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader user={profile} loading={loading} />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Προφίλ χρήστη</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Όνομα</Text>

          <TextInput
            value={profile.first_name ?? ""}
            style={styles.input}
            placeholder="Όνομα"
            placeholderTextColor="#9ca3af"
            autoCapitalize="words"
            onChangeText={(value) =>
              handleChange("first_name", value)
            }
          />

          <Text style={styles.label}>Επώνυμο</Text>

          <TextInput
            value={profile.last_name ?? ""}
            style={styles.input}
            placeholder="Επώνυμο"
            placeholderTextColor="#9ca3af"
            autoCapitalize="words"
            onChangeText={(value) =>
              handleChange("last_name", value)
            }
          />

          <Text style={styles.label}>Email</Text>

          <TextInput
            value={profile.email ?? ""}
            style={[styles.input, styles.disabledInput]}
            editable={false}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Τηλέφωνο</Text>

          <TextInput
            value={profile.phone ?? ""}
            style={styles.input}
            placeholder="Τηλέφωνο"
            placeholderTextColor="#9ca3af"
            keyboardType="phone-pad"
            onChangeText={(value) =>
              handleChange("phone", value)
            }
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            saving && styles.buttonDisabled,
          ]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Αποθήκευση</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonDelete}
          onPress={handleDeleteAccount}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            Διαγραφή λογαριασμού
          </Text>
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

  loadingContainer: {
    flex: 1,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  loadingText: {
    color: "#fff",
    marginTop: 12,
    fontSize: 15,
  },

  errorText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
  },

  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    fontSize: 15,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  disabledInput: {
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
  },

  button: {
    backgroundColor: "#ff4500",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
    marginBottom: 12,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  retryButton: {
    backgroundColor: "#ff4500",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonDelete: {
    backgroundColor: "#ef4444",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default ProfileScreen;

