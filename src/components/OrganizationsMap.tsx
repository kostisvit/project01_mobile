import React, { useRef, useState, useCallback } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { useFocusEffect } from "@react-navigation/native";

type Props = {
  organizations: any[];
};

const OrganizationsMap: React.FC<Props> = ({ organizations }) => {
  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState<Region>({
    latitude: Number(organizations[0]?.latitude ?? 35.3387),
    longitude: Number(organizations[0]?.longitude ?? 25.1442),
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useFocusEffect(
    useCallback(() => {
      if (!mapRef.current || !organizations.length) return;

      const coords = organizations.map((o) => ({
        latitude: Number(o.latitude),
        longitude: Number(o.longitude),
      }));

      setTimeout(() => {
        mapRef.current?.fitToCoordinates(coords, {
          edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
          animated: true,
        });
      }, 300);
    }, [organizations])
  );

  const zoomIn = () => {
    if (!region) return;

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
    if (!region) return;

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
    <View style={{ flex: 1, position: "relative" }}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={region}
        onRegionChangeComplete={(r) => setRegion(r)}
      >
        {organizations.map((org) => (
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

      {/* Zoom buttons */}
      <View style={styles.zoomContainer}>
        <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
          <Text style={styles.zoomText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
          <Text style={styles.zoomText}>−</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  zoomContainer: {
    position: "absolute",
    right: 10,
    bottom: 50,
    flexDirection: "column",
  },
  zoomButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    elevation: 3,
  },
  zoomText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default OrganizationsMap;