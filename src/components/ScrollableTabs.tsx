// components/ScrollableTabs.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import axios from 'axios';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Config from 'react-native-config';

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
  images: OrganizationImage[];
  // add other fields like address, rating, etc.
};

// Tab content: organizations for a type
const TabScreen: React.FC<{ typeSlug: string }> = ({ typeSlug }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<Organization[]>(`${API_URL}/organizations/?type_slug=${typeSlug}`)
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
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      snapToAlignment="center"
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: 0 }}
      renderItem={({ item }) => (
        <View style={[styles.card, { width: width * 0.85, marginHorizontal: width * 0.075 }]}>
          {/* Organization image from API */}
          <Image
            source={{
              uri: item.images?.[0]?.image_url || 'https://picsum.photos/400/300',
            }}
            style={styles.cardImage}
            resizeMode="cover"
          />

          {/* Organization info */}
          <View style={styles.infoContainer}>
            <Text style={styles.orgName}>{item.name}</Text>
            {item.phone && <Text style={styles.orgPhone}>📞 {item.phone}</Text>}
            {item.address && <Text style={styles.orgAddress}>🏠 {item.address}</Text>}
          </View>
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
        tabBarIndicatorStyle: { backgroundColor: '#34d399' },
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
    height: 160,
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