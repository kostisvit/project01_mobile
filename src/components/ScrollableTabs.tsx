// components/ScrollableTabs.tsx
import React, { useCallback, useEffect, useState } from 'react';
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
import MaterialIcons from '@react-native-vector-icons/material-icons';

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

type UserLocation = {
  latitude: number;
  longitude: number;
};

type TabScreenProps = {
  typeSlug: string;
  location: UserLocation | null;
  locationLoading: boolean;
};

// ------------------ Hook: Get User Location ------------------
const useUserLocation = () => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const requestLocation = async () => {
      try {
        setLoading(true);
        setError(null);

        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message:
                'We use your location to show nearby organizations',
              buttonPositive: 'OK',
            }
          );

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            setError('Location permission denied');
            setLoading(false);
            return;
          }
        }

        Geolocation.getCurrentPosition(
          (pos) => {
            setLocation({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
            setLoading(false);
          },
          (err) => {
            console.error('Location error:', err);
            setError(err.message || 'Unable to get location');
            setLoading(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          }
        );
      } catch (err) {
        console.error('Location permission error:', err);
        setError('Unable to get location');
        setLoading(false);
      }
    };

    requestLocation();
  }, []);

  return {
    location,
    loading,
    error,
  };
};
// ------------------ TabScreen ------------------
const TabScreen: React.FC<TabScreenProps> = ({
  typeSlug,
  location,
  locationLoading,
}) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [radius, setRadius] = useState(20); // default 20 km
  const [pendingRadius, setPendingRadius] = useState(20);

  const fetchOrganizations = useCallback(
    async (isRefresh = false) => {
      if (!typeSlug) return;

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const params: any = {
          type_slug: typeSlug,
        };

        if (location) {
          params.lat = location.latitude;
          params.lng = location.longitude;
          params.radius = radius;
        }

        const res = await api.get<Organization[]>(
          'api/organizations/',
          { params }
        );

        setOrganizations(res.data);
      } catch (err) {
        console.error('Error fetching organizations:', err);
      } finally {
        if (isRefresh) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [typeSlug, location, radius]
  );

  useEffect(() => {
    if (locationLoading) return;

    fetchOrganizations();
  }, [locationLoading, fetchOrganizations]);

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
      <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        <Text>Εύρος αναζήτησης {radius} χλμ.</Text>
        <Slider
          value={pendingRadius}
          minimumValue={1}
          maximumValue={50}
          step={1}
          onValueChange={setPendingRadius}
          onSlidingComplete={setRadius}
          minimumTrackTintColor="#ff4500"
          maximumTrackTintColor="#ccc"
        />
      </View>

      {/* Organization Cards */}
      <FlatList
        data={organizations}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={() => fetchOrganizations(true)}
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

  const {
    location,
    loading: locationLoading,
    error: locationError,
  } = useUserLocation();

  useEffect(() => {
    api
      .get<OrganizationType[]>(apiUrl.replace(`${API_URL}`, ''))
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
        tabBarActiveTintColor: '#ff4500',
        tabBarInactiveTintColor: '#999',
      }}
    >
      {types.map((type) => (
        <Tab.Screen
          key={type.slug}
          name={type.name}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons
                name={
                  type.icon as React.ComponentProps<
                    typeof MaterialIcons
                  >['name']
                }
                size={20}
                color={color}
              />
            ),
            tabBarLabel: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 15, marginLeft: 6 }}>
                  {type.name}
                </Text>
              </View>
            ),
          }}
        >
          {() => (
            <TabScreen
              typeSlug={type.slug}
              location={location}
              locationLoading={locationLoading}
            />
          )}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
};


const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default ScrollableTabs;
