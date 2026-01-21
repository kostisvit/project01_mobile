import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppHeader from '../components/AppHeader';
import { useUser } from '../context/UserContext';

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useUser();

  return (
    <View style={styles.container}>
      <AppHeader user={user} loading={loading} />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

export default DefaultLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
});