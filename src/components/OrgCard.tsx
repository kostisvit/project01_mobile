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
import type { OrgCardProps } from '../types/organization';


export const OrgCard: React.FC<OrgCardProps> = ({ org, width }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { isAuthenticated } = useAuth();
  const isOpen = org.status_info?.is_open;

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
          <View style={styles.headerRowOrgType}>
            <Text style={styles.orgType}>
              {org.organization_type.name ? ` #${org.organization_type.name}` : ''}
            </Text>
          </View>
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
                {org.average_rating?.toFixed(1) ?? '0.0'}
              </Text>
            </View>
          </View>

          <View style={styles.middleRow}>
            <View style={styles.addressRow}>
              <MaterialIcons name="location-on" size={14} color="#e53e3e" />
              <Text style={styles.orgAddress} numberOfLines={2}>
                {org.address ?? '-'}
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
                {org.phone ?? '-'}
              </Text>
            </View>

            <Text style={isOpen ? styles.statusOpen : styles.statusClosed}>
              {isOpen ? "Ανοιχτά" : "Κλειστά"}
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
  headerRowOrgType: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orgType: {
    fontSize: 14,
    color: '#718096',
    flex: 1,
    marginRight: 8,

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
    fontSize: 13,
    fontWeight: '600',
    color: '#b45309',
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
    gap: 4,
  },
  orgPhone: {
    fontSize: 14,
    color: '#1a202c',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusOpen: {
    color: '#065f46',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 12,
    overflow: 'hidden',
  },
  statusClosed: {
    color: '#991b1b',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 12,
    overflow: 'hidden',
  },

});
