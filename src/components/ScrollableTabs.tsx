// components/ScrollableTabs.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Config from 'react-native-config';
import { api } from '../api/client';
import OrganizationsMap from '../components/OrganizationsMap';
import { OrgCard } from './OrgCard';

const API_URL = Config.API_URL;
const Tab = createMaterialTopTabNavigator();
const { width } = Dimensions.get('window');

// Types
type OrganizationImage = {
  image_url: string;
};

type OrganizationType = {
  id: number;
  name: string;
  slug: string;
};

type Organization = {
  id: number;
  name: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  images: OrganizationImage[];
};
type Props = {
  organizations: Organization[];
};

// Tab content: organizations for a type
const TabScreen: React.FC<{ typeSlug: string }> = ({ typeSlug }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Organization[]>(`/organizations/?type_slug=${typeSlug}`)
      .then((res: { data: Organization[] }) => setOrganizations(res.data))
      .catch((err: unknown) => console.error(err))
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
    <View style={{ flex: 1 }}>
      {/* 📇 CARDS (TOP) */}
      <FlatList
        data={organizations}
        keyExtractor={item => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        decelerationRate="fast"
        style={{ flexGrow: 0 }} // ⬅ prevents full height
        renderItem={({ item }) => (
          <OrgCard
            org={item}
            width={width}
          />
        )}
      />

      {/* 🗺 MAP (BOTTOM) */}
      <View style={{ flex: 1 }}>
        <OrganizationsMap organizations={organizations} />
      </View>
    </View>
  );
};

// Main ScrollableTabs component
const ScrollableTabs: React.FC<{ apiUrl: string }> = ({ apiUrl }) => {
  const [types, setTypes] = useState<OrganizationType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<OrganizationType[]>(apiUrl.replace('http://127.0.0.1:8000/api', ''))
      .then((res: { data: OrganizationType[] }) => setTypes(res.data))
      .catch((err: unknown) => console.error(err))
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
        tabBarIndicatorStyle: { backgroundColor: '#ff4500' },
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
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden', // makes image respect card border radius
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // Android shadow
    marginVertical: 16,
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  infoContainer: {
    padding: 16,
  },
  orgName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  orgPhone: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  orgAddress: {
    fontSize: 14,
    color: '#555',
  },
});


export default ScrollableTabs;