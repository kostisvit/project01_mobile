import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import MaterialIcons from '@react-native-vector-icons/material-icons';


type OrgCardProps = {
  org: any; // replace with proper type if you have one
  width: number;
};

export const OrgCard: React.FC<OrgCardProps> = ({ org, width }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { isAuthenticated } = useAuth(); // ✅ get token from context


  const handlePress = () => {
    navigation.navigate("OrgDetail", { orgId: org.id });
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.pressable,
        { opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <View
        style={[
          styles.card,
          { width: width * 0.85, marginHorizontal: width * 0.075 },
        ]}
      >
        <Image
          source={{
            uri:
              org.images?.[0]?.image_url ||
              'https://picsum.photos/400/300',
          }}
          style={styles.cardImage}
          resizeMode="cover"
        />

        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.orgName} numberOfLines={1}>
              {org.name}
            </Text>

            <View style={styles.ratingRow}>
              <MaterialIcons
                name="star"
                size={14}
                color="#f59e0b"
                style={styles.star}
              />
              <Text style={styles.ratingText}>
                {org.average_rating?.toFixed(1) ?? '4.5'}
              </Text>
            </View>
          </View>

          <View style={styles.middleRow}>
            <View style={styles.addressRow}>
              <MaterialIcons name="location-on" size={14} color="#e53e3e" />
              <Text style={styles.orgAddress} numberOfLines={2}>
                {org.address ?? '123 Main Street, New York'}
              </Text>
            </View>

            <Text style={styles.comments}>
              ({org.review_count ?? 120}) Αξιολογήσεις
            </Text>
          </View>

          <View style={styles.footerRow}>
            <View style={styles.phoneRow}>
              <MaterialIcons name="phone" size={14} color="#38a169" />
              <Text style={styles.orgPhone}>
                {org.phone ?? '+1 234 567 890'}
              </Text>
            </View>

            <Text
              style={org.open_status === 'Open' ? styles.statusOpen : styles.statusClosed}
            >
              {org.open_status}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 16,
  },
  card: {
    borderRadius: 16,
    backgroundColor: '#fff',
    marginVertical: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  star: {
    marginRight: 4,
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  infoContainer: {
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  orgName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a202c',
    flex: 1,
    marginRight: 8,
  },
  rating: {
    fontSize: 14,
    color: '#444',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  ratingText: {
    fontSize: 14,
    color: '#1a202c',
  },
  comments: {
    fontSize: 12,
    color: '#718096',
  },
  orgAddress: {
    fontSize: 14,
    color: '#1a202c',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // adds 4px space between icon and text
  },
  orgPhone: {
    fontSize: 14,
    color: '#1a202c',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // space between phone icon and number
  },
  statusOpen: {
    fontSize: 12,
    color: '#38a169',
    fontWeight: '600',
  },
  statusClosed: {
    fontSize: 12,
    color: '#e53e3e',
    fontWeight: '600',
  },

});
