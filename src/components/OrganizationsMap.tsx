import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

import { Dimensions, } from 'react-native';

const { width } = Dimensions.get('window');

type Organization = {
  id: number;
  name: string;
  latitude: number | string;
  longitude: number | string;
};

type Props = {
  organizations: Organization[];
};

const OrganizationsMap: React.FC<Props> = ({ organizations }) => {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region | null>(null);

  // Fit map to all markers when organizations change
  useEffect(() => {
    if (!mapRef.current || !organizations.length) return;

    const coords = organizations.map(o => ({
      latitude: Number(o.latitude),
      longitude: Number(o.longitude),
    }));

    mapRef.current.fitToCoordinates(coords, {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      animated: true,
    });

    // Set initial region to first org
    setRegion({
      latitude: coords[0].latitude,
      longitude: coords[0].longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  }, [organizations]);

  // Zoom in/out handlers
  const zoomIn = () => {
    if (!region) return;
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    });
  };

  const zoomOut = () => {
    if (!region) return;
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    });
  };

  return (
    <View style={{ position: 'relative' }}>
      {/* Map */}
      <View style={styles.mapWrapper}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region || undefined}
          onRegionChangeComplete={r => setRegion(r)}
          zoomEnabled={true}
          scrollEnabled={true}
        >
          {organizations.map(org => (
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
      </View>

      {/* Zoom Buttons */}
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

export default OrganizationsMap;

const styles = StyleSheet.create({
  mapWrapper: {
    width,
    height: 350,
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden', // keep rounded corners
    alignSelf: 'center',
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  zoomContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,  // distance from bottom of map
    alignItems: 'center',
    zIndex: 10,  // ensures buttons sit above the map
  },

  zoomButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, // spacing between + and −
    bottom: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },

  zoomText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
});
