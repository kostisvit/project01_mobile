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

  const goToMainTabs = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

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

          console.log(latitude, longitude);

          goToMainTabs();
        },
        (error) => {
          Alert.alert('Error getting location');
          goToMainTabs();
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    } else {
      goToMainTabs();
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

      <Button
        title="Να επιτρέπεται η τοποθεσία"
        onPress={askLocation}
      />
    </View>
  );
}
