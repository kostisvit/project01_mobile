import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import AppHeader from '../components/AppHeader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from "axios";
import Config from "react-native-config";
import { useAuth } from "../context/AuthContext";
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = Config.API_URL;

const FeedbackScreen = ({ navigation }) => {
  const { user, token } = useAuth();

  const [category, setCategory] = useState("bug");
  const [message, setMessage] = useState("");
  const [name, setName] = useState(
    user?.first_name ? `${user.first_name} ${user.last_name || ""}` : ""
  );
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  const categories = [
    { key: "bug", iconName: "bug-report", label: "Σφάλμα" },
    { key: "suggestion", iconName: "lightbulb", label: "Πρόταση" },
    { key: "other", iconName: "feedback", label: "Άλλο" },
  ];

  const submitFeedback = async () => {
    if (!message.trim()) {
      Alert.alert("Σφάλμα", "Παρακαλώ γράψτε το μήνυμά σας.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_URL}api/feedback/nearme`,
        {
          category,
          message,
          name: !user ? name || "Anonymous" : undefined,
          email: !user ? email || "" : undefined,
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      Alert.alert("Το σχόλιο σας στάλθηκε με επιτυχία. \nΣας ευχαριστούμε.");
      setMessage("");
      setName(user?.first_name ? `${user.first_name} ${user.last_name || ""}` : "");
      setEmail(user?.email || "");
      navigation.goBack();
    } catch (err) {
      console.error(err.response?.data || err);
      Alert.alert("Σφάλμα", "Η αποστολή απέτυχε.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader user={user && !loading ? user : null} loading={loading} />

      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
        <Text style={styles.title}>Αποστολή Σχολίων</Text>

        <Text style={styles.label}>Κατηγορία</Text>
        <View style={{ flexDirection: "row", marginVertical: 10 }}>
          {categories.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => setCategory(item.key)}
              style={[
                styles.categoryBtn,
                category === item.key && styles.categoryActive
              ]}
            >
              <MaterialIcons
                name={item.iconName}
                size={20}
                color="#fff"
                style={{ marginRight: 6 }}
              />
              <Text style={{ color: "#fff" }}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Guest fields */}
        {!user && (
          <>
            <Text style={styles.label}>Όνομα</Text>
            <TextInput
              placeholder="Όνομα (προαιρετικό)"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
              style={styles.input_guest}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Email (προαιρετικό)"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.input_guest}
            />
          </>
        )}

        <Text style={styles.label}>Μήνυμα</Text>
        <TextInput
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
          placeholder="Γράψτε τα σχόλιά σας..."
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />
        <Text style={styles.counter}>{message.length} / 500 χαρακτήρες</Text>

        <Pressable
          onPress={submitFeedback}
          disabled={loading}
          style={[styles.button, { opacity: loading ? 0.6 : 1 }]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Αποστολή</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 10,
    padding: 10,
    minHeight: 120,
    marginTop: 10,
    color: '#fff',
  },
  input_guest: {
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    marginTop: 10,
    color: '#fff',
  },
  counter: {
    color: "#9CA3AF",
    marginTop: 6,
  },
  button: {
    backgroundColor: "#FF4500",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  categoryBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 8,
    marginRight: 10,
  },
  categoryActive: {
    backgroundColor: "#FF4500",
    borderColor: "#FF4500",
  },
});

export default FeedbackScreen;