import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppHeader from '../components/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

type DefaultLayoutProps = {
  children: React.ReactNode;
  loading: boolean;
};

const DefaultLayout = ({ children, loading }: DefaultLayoutProps) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader loading={loading} />
      <View style={styles.content}>
        {children}
      </View>
    </SafeAreaView>
  );
};

export default DefaultLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    flex: 1,
  },
});
