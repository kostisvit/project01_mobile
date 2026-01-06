// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScrollableTabs from '../components/ScrollableTabs';
import { SafeAreaView } from 'react-native-safe-area-context';


const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Home</Text>
      </View>

      {/* Tab Section */}
      <View style={styles.tabSection}>
        <ScrollableTabs apiUrl="http://127.0.0.1:8000/api/org-types/" />
      </View>

      {/* Other content */}
      <View style={styles.content}>
        <Text>Other content here</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#34d399' },
  header: { height: 80, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  tabSection: { flex: 1 }, // Tabs take remaining space
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});

export default HomeScreen;