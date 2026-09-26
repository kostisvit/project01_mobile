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
  TouchableOpacity,
  Modal,
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

type OrganizationImage = {
  image_url: string;
};

type OrganizationType = {
  id: number;
  name: string;
  slug: string;
  icon: string;
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
                'We use your location to show nearby organizations.',
              buttonPositive: 'OK',
            },
          );

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            setError('Location permission denied');
            setLoading(false);
            return;
          }
        }

        Geolocation.getCurrentPosition(
          position => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });

            setLoading(false);
          },
          error => {
            console.error('Location error:', error);

            setError(
              error.message || 'Unable to get your current location',
            );

            setLoading(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          },
        );
      } catch (error) {
        console.error('Location permission error:', error);

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
  const [error, setError] = useState<string | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [radius, setRadius] = useState(20);
  const [pendingRadius, setPendingRadius] = useState(20);


  //---------------Filter Options----------------
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [appliedRating, setAppliedRating] = useState<number | null>(null);
  const resetFilters = () => {
    setSelectedRating(null);
    setAppliedRating(null);
    setPendingRadius(20);
    setRadius(20);
    setFilterModalVisible(false);
  }


  const fetchOrganizations = useCallback(
    async (isRefresh = false) => {
      if (!typeSlug) {
        return;
      }

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        const params: Record<string, number | string> = {
          type_slug: typeSlug,
        };

        if (location) {
          params.lat = location.latitude;
          params.lng = location.longitude;
          params.radius = radius;
        }
        if (appliedRating !== null) {
          params.min_rating = appliedRating;
        }

        console.log('Fetching organizations:', params);

        const res = await api.get<Organization[]>(
          'api/organizations/',
          {
            params,
          },
        );

        console.log('Organizations:', res.data);

        setOrganizations(res.data);
      } catch (err: any) {
        console.error(
          'Error fetching organizations:',
          err?.response?.data || err?.message || err,
        );

        setError(
          err?.response?.data?.detail ||
            err?.message ||
            'Unable to load organizations.',
        );

        setOrganizations([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [typeSlug, location, appliedRating,radius],
  );

  useEffect(() => {
    if (locationLoading) {
      return;
    }

    fetchOrganizations();
  }, [locationLoading, fetchOrganizations]);

  // ------------------ Loading ------------------

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#FF4500"
        />
      </View>
    );
  }

  // ------------------ Main content ------------------

  return (
    <View style={styles.container}>

      {/* Radius selector - ALWAYS visible */}
      <View style={styles.radiusContainer}>
        <View style={styles.radiusHeader}>
          <Text style={styles.radiusLabel}>
            Εύρος αναζήτησης
          </Text>

          <Text style={styles.radiusValue}>
            {radius} χλμ.
          </Text>
        </View>

        <View style={styles.radiusRow}>
          <Slider
            style={styles.slider}
            value={pendingRadius}
            minimumValue={1}
            maximumValue={100}
            step={1}
            onValueChange={value => {
              setPendingRadius(value);
            }}
            onSlidingComplete={value => {
              setRadius(value);
            }}
            minimumTrackTintColor="#ff4500"
            maximumTrackTintColor="#ccc"
            thumbTintColor="#ff4500"
          />

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <MaterialIcons
              name="filter-alt"
              size={24}
              color="#ff4500"
            />
          </TouchableOpacity>
        </View>
          <Modal
              visible={filterModalVisible}
              animationType="slide"
              transparent
              onRequestClose={() => setFilterModalVisible(false)}
            >
          <View style={styles.modalOverlay}>
            <View style={styles.filterModal}>

              {/* Header */}
              <View style={styles.filterHeader}>
                <Text style={styles.filterTitle}>
                  Φίλτρα
                </Text>

                <TouchableOpacity
                  onPress={() => setFilterModalVisible(false)}
                >
                  <MaterialIcons
                    name="close"
                    size={26}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>
              {/* Rating */}
              <Text style={styles.sectionTitle}>
                Αξιολόγηση
              </Text>

                <View style={styles.optionsRow}>
                  {[4, 3, 2].map(rating => (
                    <TouchableOpacity
                      key={rating}
                      style={[
                        styles.optionButton,
                        selectedRating === rating &&
                          styles.optionButtonActive,
                      ]}
                      onPress={() => {
                        setSelectedRating(
                          selectedRating === rating
                            ? null
                            : rating,
                        );
                      }}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selectedRating === rating &&
                            styles.optionTextActive,
                        ]}
                      >
                        ⭐ {rating}+
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

              {/* Apply */}
              <View style={styles.filterActions}>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={resetFilters}
                >
                  <Text style={styles.resetButtonText}>
                    Επαναφορά
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => {
                    setAppliedRating(selectedRating);
                    setFilterModalVisible(false);
                  }}
                >
                  <Text style={styles.applyButtonText}>
                    Εφαρμογή
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>
      </View>

      {/* Error */}
      {error ? (
        <View style={styles.messageContainer}>
          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      ) : null}

      {/* No results */}
      {!error && organizations.length === 0 ? (
        <View style={styles.messageContainer}>
          <Text style={styles.emptyTitle}>
            Δεν βρέθηκαν αποτελέσματα
          </Text>

          <Text style={styles.emptyText}>
            Δεν υπάρχουν συνεργαζόμενες επιχειρήσεις σε ακτίνα {radius} χλμ.
          </Text>

          <Text style={styles.emptyHint}>
            Δοκίμασε να αυξήσεις την ακτίνα αναζήτησης.
          </Text>
        </View>
      ) : null}

      {/* Results */}
      {organizations.length > 0 ? (
        <>
          {/* Organization Cards */}
          <FlatList
            data={organizations}
            keyExtractor={item => item.id.toString()}
            refreshing={refreshing}
            onRefresh={() => fetchOrganizations(true)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            decelerationRate="fast"
            style={styles.cardsList}
            renderItem={({ item }) => (
              <OrgCard
                org={item}
                width={width}
              />
            )}
          />

          {/* Map */}
          <View style={styles.mapContainer}>
            <OrganizationsMap
              organizations={organizations}
            />
          </View>
        </>
      ) : null}
    </View>
  );
};

// ------------------ ScrollableTabs ------------------

const ScrollableTabs: React.FC<{ apiUrl: string }> = ({
  apiUrl,
}) => {
  const [types, setTypes] = useState<OrganizationType[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    location,
    loading: locationLoading,
  } = useUserLocation();

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const endpoint = apiUrl.replace(`${API_URL}`, '');

        const res = await api.get<OrganizationType[]>(
          endpoint,
        );

        console.log('Organization types:', res.data);

        setTypes(res.data);
      } catch (err: any) {
        console.error(
          'Error fetching types:',
          err?.response?.data || err?.message || err,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTypes();
  }, [apiUrl]);

  // ------------------ Loading ------------------

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#FF4500"
        />
      </View>
    );
  }

  // ------------------ No types ------------------

  if (!types.length) {
    return (
      <View style={styles.center}>
        <Text>
          No organization types found
        </Text>
      </View>
    );
  }

  // ------------------ Tabs ------------------

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,

        tabBarIndicatorStyle: {
          backgroundColor: '#ff4500',
        },

        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },

        tabBarStyle: {
          elevation: 0,
          shadowOpacity: 0,
        },

        tabBarActiveTintColor: '#ff4500',
        tabBarInactiveTintColor: '#999',
      }}
    >
      {types.map(type => (
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
              <View style={styles.tabLabel}>
                <Text style={styles.tabLabelText}>
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

// ------------------ Styles ------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radiusContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
// ------------------ Radius Selector ------------------
  radiusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  radiusLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  radiusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radiusValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ff4500',
  },
  // sliderWrapper: {
  //   width: '75%',       // makes it shorter
  //   alignSelf: 'center',
  // },
  slider: {
    flex: 1,
    height: 40,
  },

  //-------------------- Filter Modal ------------------
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    minHeight: '50%',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  filterIcon: {
    fontSize: 20,
    marginRight: 5,
    color: '#ff4500',
  },
  filterTitle: {
    fontSize: 22,
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
  },

  applyButton: {
    flex: 1,
    backgroundColor: '#ff4500',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },

  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  cardsList: {
    flexGrow: 0,
  },

  mapContainer: {
    flex: 1,
  },

  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#555',
    marginBottom: 6,
  },

  emptyHint: {
    fontSize: 14,
    textAlign: 'center',
    color: '#888',
  },

  errorText: {
    fontSize: 15,
    color: '#cc0000',
    textAlign: 'center',
  },

  tabLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  tabLabelText: {
    fontSize: 15,
    marginLeft: 6,
  },

  optionsRow: {
    flexDirection: 'row',
    gap: 10,
  },

  optionButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },

  optionButtonActive: {
    backgroundColor: '#ff4500',
    borderColor: '#ff4500',
  },

  optionText: {
    color: '#333',
    fontWeight: '600',
  },

  optionTextActive: {
    color: '#fff',
  },
  filterActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 30,
  },

  resetButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  resetButtonText: {
    color: '#555',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ScrollableTabs;
