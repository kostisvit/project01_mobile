import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function EmailVerifiedScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✅</Text>

      <Text style={styles.title}>Email Verified!</Text>

      <Text style={styles.text}>
        Your account is now active. You can log in.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  icon: { fontSize: 64, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  text: { textAlign: "center", marginBottom: 20, color: "#666" },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});