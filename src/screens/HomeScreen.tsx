// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScrollableTabs from '../components/ScrollableTabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import Config from 'react-native-config';

const API_URL = Config.API_URL;

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Καλώς ήλθατε στο NearMe</Text>
      </View>

      {/* Tab Section */}
      <View style={styles.tabSection}>
        <ScrollableTabs apiUrl={`${API_URL}/org-types/`} />
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