// components/ScrollableTabs.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Dimensions,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Config from 'react-native-config';
import Geolocation from 'react-native-geolocation-service';
import { api } from '../api/client';
import OrganizationsMap from './OrganizationsMap';
import { OrgCard } from './OrgCard';
import Slider from '@react-native-community/slider';
import { Image } from 'react-native';


const API_URL = Config.API_URL;
const Tab = createMaterialTopTabNavigator();
const { width } = Dimensions.get('window');

type OrganizationImage = { image_url: string };
type OrganizationType = { id: number; name: string; slug: string; icon: string; };
type Organization = {
  id: number;
  name: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  images: OrganizationImage[];
};

// ------------------ Hook: Get User Location ------------------
const useUserLocation = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    const requestLocation = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'We use your location to show nearby organizations',
              buttonPositive: 'OK',
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert('Permission denied', 'Cannot fetch nearby organizations without location.');
            return;
          }
        }

        Geolocation.getCurrentPosition(
          (pos) =>
            setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
          (error) => console.error('Location error', error),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } catch (err) {
        console.error(err);
      }
    };

    requestLocation();
  }, []);

  return location;
};

// ------------------ TabScreen ------------------
const TabScreen: React.FC<{ typeSlug: string }> = ({ typeSlug }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(20); // default 20 km
  const location = useUserLocation();

  const fetchOrganizations = async () => {
    if (!typeSlug) return;
    setLoading(true);

    try {
      const params: any = { type_slug: typeSlug };
      if (location) {
        params.lat = location.latitude;
        params.lng = location.longitude;
        params.radius = radius;
      }

      const res = await api.get<Organization[]>('/organizations/', { params });
      setOrganizations(res.data);
    } catch (err) {
      console.error('Error fetching organizations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when typeSlug, location, or radius changes
  useEffect(() => {
    fetchOrganizations();
  }, [typeSlug, location, radius]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF4500" />
      </View>
    );

  if (!organizations.length)
    return (
      <View style={styles.center}>
        <Text>Δεν βρέθηκαν αποτελέσματα.</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      {/* Radius Slider */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        <Text>Εύρος αναζήτησης {radius} km</Text>
        <Slider
          value={radius}
          minimumValue={1}
          maximumValue={50}
          step={1}
          onValueChange={setRadius}
          minimumTrackTintColor="#ff4500"
          maximumTrackTintColor="#ccc"
        />
      </View>

      {/* Organization Cards */}
      <FlatList
        data={organizations}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        decelerationRate="fast"
        style={{ flexGrow: 0 }}
        renderItem={({ item }) => <OrgCard org={item} width={width} />}
      />

      {/* Map */}
      <View style={{ flex: 1 }}>
        <OrganizationsMap organizations={organizations} />
      </View>
    </View>
  );
};

// ------------------ ScrollableTabs ------------------
const ScrollableTabs: React.FC<{ apiUrl: string }> = ({ apiUrl }) => {
  const [types, setTypes] = useState<OrganizationType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<OrganizationType[]>(apiUrl.replace('http://127.0.0.1:8000/api', ''))
      .then((res) => setTypes(res.data))
      .catch((err) => console.error('Error fetching types:', err))
      .finally(() => setLoading(false));
  }, [apiUrl]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (!types.length)
    return (
      <View style={styles.center}>
        <Text>No organization types found</Text>
      </View>
    );

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarIndicatorStyle: { backgroundColor: '#ff4500' },
        tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' },
        tabBarStyle: { elevation: 0, shadowOpacity: 0 },
      }}
    >
      {types.map((type) => (
        <Tab.Screen
          key={type.slug}
          name={type.name}
          options={{
            tabBarIcon: () => <View />, // empty to satisfy TS
            tabBarLabel: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={{ uri: type.icon }}
                  style={{
                    width: 22,
                    height: 22,
                    marginRight: 6,
                    resizeMode: 'contain', // keeps colors intact
                  }}
                />
                <Text style={{ fontSize: 15, color: '#000' }}>{type.name}</Text>
              </View>
            ),
            tabBarActiveTintColor: undefined, // prevent React Navigation from forcing blue
            tabBarInactiveTintColor: undefined,
          }}
        >
          {() => <TabScreen typeSlug={type.slug} />}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
};

// ------------------ Styles ------------------
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default ScrollableTabs;
