import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  Linking,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AppHeader from '../components/AppHeader';
import Config from 'react-native-config';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

import { useAuth } from '../context/AuthContext';
import { Alert } from 'react-native';


const API_URL = Config.API_URL;

type OrgDetailRouteProp = RouteProp<RootStackParamList, 'OrgDetail'>;

type OrganizationImage = { image_url: string };
type Organization = {
  id: number;
  name: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  images: OrganizationImage[];
};

type Props = { route: OrgDetailRouteProp };

const OrgDetailScreen: React.FC<Props> = ({ route }) => {
  const { orgId } = route.params;
  const { user, token } = useAuth(); // ✅ get token here

  //const [user, setUser] = useState<any>(null);
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      console.warn("User not logged in, cannot fetch org details");
      setLoading(false);
      return;
    }

    axios
      .get<Organization>(`${API_URL}/organizations/${orgId}/`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ include token here
        },
      })
      .then(res => setOrg(res.data))
      .catch(err => {
        console.error("Error fetching org:", err.response?.status, err.response?.data);
        if (err.response?.status === 401) {
          Alert.alert(
            "Session expired",
            "Please log in again",
            [{ text: "OK" }]
          );
        }
      })
      .finally(() => setLoading(false));
  }, [orgId, token]); // ✅ include token in dependency array

  if (!org) {
    return (
      <View style={styles.container}>
        <AppHeader user={user} loading={loading} />
        <View style={styles.center}>
          <Text>Organization not found</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader user={user} loading={loading} />
      <View style={styles.org_detail_container}>
        <ScrollView>
          {/* 🖼 IMAGE */}
          <Image
            source={{
              uri: org.images?.[0]?.image_url || 'https://picsum.photos/600/400',
            }}
            style={styles.image}
          />

          {/* 🏷 NAME */}
          <Text style={styles.name}>{org.name}</Text>

          {/* 📍 ADDRESS */}
          <Text style={styles.text}>📍 {org.address}</Text>

          {/* 📞 PHONE */}
          {org.phone && (
            <Pressable onPress={() => Linking.openURL(`tel:${org.phone}`)}>
              <Text style={styles.phone}>📞 {org.phone}</Text>
            </Pressable>
          )}

          {/* 🌍 MAP LINK */}
          {org.latitude && org.longitude && (
            <Pressable
              style={styles.mapButton}
              onPress={() =>
                Linking.openURL(
                  `https://www.google.com/maps/search/?api=1&query=${org.latitude},${org.longitude}`
                )
              }
            >
              <Text style={styles.mapButtonText}>Open in Maps</Text>
            </Pressable>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

// const HEADER_HEIGHT = 95; // same as AppHeader

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34d399',
  },
  org_detail_container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  phone: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 8,
  },
  mapButton: {
    backgroundColor: '#00796b',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  mapButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default OrgDetailScreen;


