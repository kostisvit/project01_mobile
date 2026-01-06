// components/ScrollableTabs.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import axios from 'axios';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();
const { width } = Dimensions.get('window');

// Types
type OrganizationType = {
  id: number;
  name: string;
  slug: string;
};

type Organization = {
  id: number;
  name: string;
  phone: string;
  image?: string;
  // add other fields like address, rating, etc.
};

// Tab content: organizations for a type
const TabScreen: React.FC<{ typeSlug: string }> = ({ typeSlug }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<Organization[]>(`http://127.0.0.1:8000/api/organizations/?type_slug=${typeSlug}`)
      .then(res => setOrganizations(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [typeSlug]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!organizations.length) {
    return (
      <View style={styles.center}>
        <Text>No organizations found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={organizations}
      keyExtractor={item => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
          <Text style={styles.name}>{item.name} {item.phone}</Text>
        </View>
      )}
    />
  );
};

// Main ScrollableTabs component
const ScrollableTabs: React.FC<{ apiUrl: string }> = ({ apiUrl }) => {
  const [types, setTypes] = useState<OrganizationType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<OrganizationType[]>(apiUrl)
      .then(res => setTypes(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [apiUrl]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!types.length) {
    return (
      <View style={styles.center}>
        <Text>No organization types found</Text>
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarIndicatorStyle: { backgroundColor: 'blue' },
        tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' },
        tabBarStyle: { elevation: 0, shadowOpacity: 0 }, // optional
      }}
    >
      {types.map(type => (
        <Tab.Screen
          key={type.slug}
          name={type.name}
          children={() => <TabScreen typeSlug={type.slug} />}
        />
      ))}
    </Tab.Navigator>
  );
};

// Styles
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    width: width * 0.7,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
    padding: 10,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  name: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  phone: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScrollableTabs;