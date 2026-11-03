import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
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

  const isOpen = org.status_info?.is_open;

  const handlePress = () => {
    navigation.navigate("OrgDetail", {
      orgId: org.id,
    });
  };

  const cardWidth = Math.min(width * 0.85, 420)

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
          {
            width: cardWidth,
            marginHorizontal: (width - cardWidth) / 2,
          }
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
          {/* <View style={styles.headerRowOrgType}>
            <Text style={styles.orgType}>
              {org.organization_type.name ? ` #${org.organization_type.name}` : ''}
            </Text>
          </View> */}
          <View style={styles.headerRow}>
            <Text style={styles.orgName} numberOfLines={1}>
              {org.name}
            </Text>

            <View style={styles.ratingRow}>
              <MaterialIcons
                name="star"
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

            <Text
              style={
                isOpen === undefined
                  ? styles.statusUnknown
                  : isOpen
                    ? styles.statusOpen
                    : styles.statusClosed
              }
            >
              {isOpen === undefined
                ? 'Ωράριο μη διαθέσιμο'
                : isOpen
                  ? 'Ανοιχτά'
                  : 'Κλειστά'}
            </Text>
          </View>
          {/* <View style={styles.footerRow}>
            <View style={styles.emailRow}>
              <MaterialIcons name="email" size={14} color="#3182ce" />
              <Text style={styles.orgEmail}
                    numberOfLines={1}
                    ellipsizeMode='tail'>
                {org.email ?? "-"}
              </Text>

              {org.is_verified && (
                <MaterialIcons
                  name="verified"
                  size={17}
                  color="#3182ce"
                  accessibilityLabel="Επιβεβαιωμένος οργανισμός"
                />
              )}
            </View>
            </View> */}
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
  cardImage: {
    width: '100%',
    height: 190,
  },
  infoContainer: {
    padding: 14,
  },
  // Styles for header row
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
    fontSize: 17,
    fontWeight: '700',
    color: '#1a202c',
    flex: 1,
    marginRight: 8,
  },
  star: {
    marginRight: 4,
    fontSize: 14,
    color: "#f59e0b"
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
    fontWeight: '600',
    color: '#b45309',
  },
  // Styles for middle row
  comments: {
    fontSize: 14,
    color: '#718096',
  },
  orgAddress: {
    fontSize: 14,
    color: '#1a202c',
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
    // Styles for footer row
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
    fontSize: 14,
    overflow: 'hidden',
  },
  statusClosed: {
    color: '#991b1b',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 14,
    overflow: 'hidden',
  },
  statusUnknown: {
    color: '#4a5568',
    backgroundColor: '#edf2f7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 12,
    overflow: 'hidden',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
//   emailRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//   },

// orgEmail: {
//     fontSize: 14,
//     color: '#1a202c',
//   },
});
