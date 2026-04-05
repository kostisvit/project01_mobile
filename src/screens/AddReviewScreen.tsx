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
import MaterialIcons from '@react-native-vector-icons/material-icons';
import axios from "axios";
import Config from "react-native-config";
import { useAuth } from "../context/AuthContext";
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = Config.API_URL;

const AddReviewScreen = ({ route, navigation }) => {
  const { orgId } = route.params;
  const { user, token } = useAuth();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    if (!rating || !comment.trim()) {
      Alert.alert("Σφάλμα", "Παρακαλώ συμπληρώστε βαθμολογία και σχόλιο.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_URL}api/reviews/`, // make sure matches your DRF URL
        { organization: orgId, rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      Alert.alert("Επιτυχία", "Το σχόλιό σας υποβλήθηκε!");
      navigation.goBack(); // return to OrgDetailScreen
    } catch (err) {
      console.error(err.response?.data || err);
      Alert.alert("Σφάλμα", "Δημιουργία σχολίου απέτυχε.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader user={user} loading={loading} />
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={styles.rateText}>Βαθμολογία</Text>
        <View style={{ flexDirection: "row", marginVertical: 10 }}>
          {[1, 2, 3, 4, 5].map((num) => (
            <Pressable key={num} onPress={() => setRating(num)}>
              <MaterialIcons
                name={num <= rating ? "star" : "star-border"}
                size={32}
                color="#f59e0b"
              />
            </Pressable>
          ))}
        </View>

        <Text style={styles.reviewTextTitle}>Σχόλιο</Text>
        <TextInput
          value={comment}
          onChangeText={setComment}
          multiline
          placeholder="Γράψε την εμπειρία σου..."
          placeholderTextColor="#fff"
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 10,
            padding: 10,
            minHeight: 100,
            marginTop: 10,
            color: '#fff'
          }}
        />
        <Text style={styles.reviewTextTitle}>
          {comment.length} / 500 χαρακτήρες
        </Text>
        <Pressable
          onPress={submitReview}
          disabled={loading}
          style={{
            backgroundColor: "#FF4500",
            padding: 12,
            borderRadius: 10,
            marginTop: 20,
            alignItems: "center",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Υποβολή</Text>
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
  rateText: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 6
  },
  reviewTextTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 6
  },
  reviewHelpText: {
    color: "#6b7280",
    marginBottom: 12
  }
})

export default AddReviewScreen;