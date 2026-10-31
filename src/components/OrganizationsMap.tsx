
import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

type Organization = {
  id: string | number;
  name: string;
  latitude: number | string;
  longitude: number | string;
};

type Props = {
  organizations: Organization[];
};

const DEFAULT_REGION: Region = {
  latitude: 35.3387,
  longitude: 25.1442,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const OrganizationsMap: React.FC<Props> = ({ organizations }) => {
  const mapRef = useRef<MapView>(null);

  const [mapReady, setMapReady] = useState(false);
  const [mapLaidOut, setMapLaidOut] = useState(false);

  const validOrganizations = useMemo(
    () =>
      organizations.filter(org => {
        const lat = Number(org.latitude);
        const lng = Number(org.longitude);

        return (
          org.latitude !== '' &&
          org.longitude !== '' &&
          Number.isFinite(lat) &&
          Number.isFinite(lng) &&
          lat >= -90 &&
          lat <= 90 &&
          lng >= -180 &&
          lng <= 180
        );
      }),
    [organizations],
  );

  const [region, setRegion] = useState<Region>(() => {
    const first = validOrganizations[0];

    return first
      ? {
          latitude: Number(first.latitude),
          longitude: Number(first.longitude),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }
      : DEFAULT_REGION;
  });

  // Fit markers only after the native map is ready and laid out.
  useEffect(() => {
    if (!mapReady || !mapLaidOut || !mapRef.current) {
      return;
    }

    if (validOrganizations.length === 0) {
      return;
    }

    const coordinates = validOrganizations.map(org => ({
      latitude: Number(org.latitude),
      longitude: Number(org.longitude),
    }));

    if (coordinates.length === 1) {
      mapRef.current.animateToRegion(
        {
          ...coordinates[0],
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        500,
      );
    } else {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: {
          top: 60,
          right: 60,
          bottom: 60,
          left: 60,
        },
        animated: true,
      });
    }
  }, [mapReady, mapLaidOut, validOrganizations]);

  const zoomIn = () => {
    const nextRegion = {
      ...region,
      latitudeDelta: Math.max(0.002, region.latitudeDelta / 2),
      longitudeDelta: Math.max(0.002, region.longitudeDelta / 2),
    };

    mapRef.current?.animateToRegion(nextRegion, 300);
  };

  const zoomOut = () => {
    const nextRegion = {
      ...region,
      latitudeDelta: Math.min(1, region.latitudeDelta * 2),
      longitudeDelta: Math.min(1, region.longitudeDelta * 2),
    };

    mapRef.current?.animateToRegion(nextRegion, 300);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onMapReady={() => setMapReady(true)}
        onLayout={() => setMapLaidOut(true)}
        onRegionChangeComplete={setRegion}
      >
        {validOrganizations.map(org => (
          <Marker
            key={String(org.id)}
            coordinate={{
              latitude: Number(org.latitude),
              longitude: Number(org.longitude),
            }}
            title={org.name}
          />
        ))}
      </MapView>

      <View style={styles.zoomContainer}>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={zoomIn}
          accessibilityLabel="Zoom in"
        >
          <Text style={styles.zoomText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.zoomButton}
          onPress={zoomOut}
          accessibilityLabel="Zoom out"
        >
          <Text style={styles.zoomText}>−</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },

  zoomContainer: {
    position: 'absolute',
    right: 10,
    bottom: 20,
  },

  zoomButton: {
    width: 45,
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  zoomText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default OrganizationsMap;
