import React from 'react';
import { View, Text, Button, Alert, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'LocationPermission'
>;

export default function LocationPermissionScreen({ navigation }: Props) {

  const askLocation = async () => {
    const permission = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    );

    if (permission === RESULTS.GRANTED) {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Save location (context / redux / backend)
          console.log(latitude, longitude);

          navigation.replace('Home');
        },
        (error) => {
          Alert.alert('Error getting location');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      navigation.replace('Home'); // continue without location
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>
        Να επιτρέπεται η πρόσβαση στην τοποθεσία σας;
      </Text>
      <Text style={{ marginBottom: 20 }}>
        Η τοποθεσία σας χρησιμοποιείται για την προβολή κοντινών επιχειρήσεων και εκδηλώσεων.
      </Text>
      <Button title="Allow Location" onPress={askLocation} />
    </View>
  );
}
