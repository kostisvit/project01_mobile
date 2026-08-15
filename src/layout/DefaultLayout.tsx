import React from 'react';
import { StyleSheet } from 'react-native';
import AppHeader from '../components/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

type DefaultLayoutProps = {
  children: React.ReactNode;
  loading: boolean;
};

const DefaultLayout = ({ children, loading }: DefaultLayoutProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader loading={loading} />
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
});