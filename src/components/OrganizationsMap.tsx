import React, { useRef, useState, useCallback } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { useFocusEffect } from "@react-navigation/native";

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

  const validOrganizations = organizations.filter(
    (org) =>
      Number.isFinite(Number(org.latitude)) &&
      Number.isFinite(Number(org.longitude))
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

  useFocusEffect(
    useCallback(() => {
      if (!mapRef.current || validOrganizations.length === 0) {
        return;
      }

      const coords = validOrganizations.map((org) => ({
        latitude: Number(org.latitude),
        longitude: Number(org.longitude),
      }));

      const timeout = setTimeout(() => {
        mapRef.current?.fitToCoordinates(coords, {
          edgePadding: {
            top: 80,
            right: 80,
            bottom: 80,
            left: 80,
          },
          animated: true,
        });
      }, 300);

      return () => clearTimeout(timeout);
    }, [organizations])
  );

  const zoomIn = () => {
    mapRef.current?.animateToRegion(
      {
        ...region,
        latitudeDelta: Math.max(0.002, region.latitudeDelta / 2),
        longitudeDelta: Math.max(0.002, region.longitudeDelta / 2),
      },
      300
    );
  };

  const zoomOut = () => {
    mapRef.current?.animateToRegion(
      {
        ...region,
        latitudeDelta: Math.min(1, region.latitudeDelta * 2),
        longitudeDelta: Math.min(1, region.longitudeDelta * 2),
      },
      300
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
      >
        {validOrganizations.map((org) => (
          <Marker
            key={org.id}
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
    position: "relative",
  },

  map: {
    flex: 1,
  },

  zoomContainer: {
    position: "absolute",
    right: 10,
    bottom: 50,
  },

  zoomButton: {
    width: 45,
    height: 45,
    backgroundColor: "#fff",
    borderRadius: 6,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  zoomText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default OrganizationsMap;