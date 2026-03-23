import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet
} from "react-native";
import AppHeader from '../components/AppHeader';
import axios from "axios";
import Config from "react-native-config";
import { useAuth } from "../context/AuthContext";
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = Config.API_URL;

const FeedbackScreen = ({ navigation }) => {
  const { user, token } = useAuth();

  const [category, setCategory] = useState("bug");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitFeedback = async () => {
    if (!message.trim()) {
      Alert.alert("Σφάλμα", "Παρακαλώ γράψτε το μήνυμά σας.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/nearme/feedback/`,
        {
          category,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Alert.alert("Επιτυχία", "Τα σχόλιά σας στάλθηκαν!");
      setMessage("");
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
      <AppHeader user={user} loading={loading} />

      <View style={{ flex: 1, padding: 16 }}>
        <Text style={styles.title}>Αποστολή Σχολίων</Text>

        {/* CATEGORY */}
        <Text style={styles.label}>Κατηγορία</Text>
        <View style={{ flexDirection: "row", marginVertical: 10 }}>
          {[
            { key: "bug", label: "🐞 Σφάλμα" },
            { key: "suggestion", label: "💡 Πρόταση" },
            { key: "other", label: "📝 Άλλο" },
          ].map((item) => (
            <Pressable
              key={item.key}
              onPress={() => setCategory(item.key)}
              style={[
                styles.categoryBtn,
                category === item.key && styles.categoryActive
              ]}
            >
              <Text style={{ color: "#fff" }}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* MESSAGE */}
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

        <Text style={styles.counter}>
          {message.length} / 500 χαρακτήρες
        </Text>

        {/* SUBMIT */}
        <Pressable
          onPress={submitFeedback}
          disabled={loading}
          style={[
            styles.button,
            { opacity: loading ? 0.6 : 1 }
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Αποστολή</Text>
          )}
        </Pressable>
      </View>
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
    marginBottom: 16
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 6
  },
  input: {
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 10,
    padding: 10,
    minHeight: 120,
    marginTop: 10,
    color: '#fff'
  },
  counter: {
    color: "#9CA3AF",
    marginTop: 6
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
    fontWeight: "bold"
  },
  categoryBtn: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 8,
    marginRight: 10,
  },
  categoryActive: {
    backgroundColor: "#FF4500",
    borderColor: "#FF4500",
  }
});

export default FeedbackScreen;