import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppHeader from '../components/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserProfile } from "../types/User";

type DefaultLayoutProps = {
  children: React.ReactNode;
  user: UserProfile | null;
  loading: boolean;
};

const DefaultLayout = ({ children, user, loading }: DefaultLayoutProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader user={user} loading={loading} />
      {children}
    </SafeAreaView>
  );
};

export default DefaultLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A'
  },
  // content: {
  //   flex: 1,
  //   backgroundColor: '#f9f9f9',
  // },
});