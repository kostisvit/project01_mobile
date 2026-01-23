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

type OrgCardProps = {
  org: any; // replace with proper type if you have one
  width: number;
};

export const OrgCard: React.FC<OrgCardProps> = ({ org, width }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { isAuthenticated } = useAuth(); // ✅ get token from context


  const handlePress = () => {
    if (!isAuthenticated) {
      // ✅ If not logged in, prompt login
      Alert.alert(
        "Προσοχή",
        "Πρέπει να συνδεθείτε για να δείτε τις λεπτομέρειες της επιχείρησης.",
        [
          { text: "Επιστροφή", style: "cancel" },
          {
            text: "Είσοδος",
            onPress: () =>
              navigation.navigate("Login", {
                redirectTo: "OrgDetail",
                redirectParams: { orgId: org.id },
              }),
          },
        ]
      );
      return;
    }

    // ✅ If logged in, navigate directly to OrgDetail
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
            <Text style={styles.rating}>
              ⭐ {org.average_rating?.toFixed(1) ?? '4.5'}
            </Text>
          </View>

          <View style={styles.middleRow}>
            <Text style={styles.orgAddress} numberOfLines={2}>
              📍 {org.address ?? '123 Main Street, New York'}
            </Text>
            <Text style={styles.comments}>
              ({org.review_count ?? 120}) reviews
            </Text>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.orgPhone}>
              📞 {org.phone ?? '+1 234 567 890'}
            </Text>
            <Text style={styles.statusOpen}>🟢 Open</Text>
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
    marginBottom: 4,
  },
  orgName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  rating: {
    fontSize: 14,
    color: '#444',
  },
  comments: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  orgAddress: {
    fontSize: 14,
    color: '#666',
    marginVertical: 6,
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
  orgPhone: {
    fontSize: 14,
    color: '#444',
  },
  statusOpen: {
    fontSize: 13,
    color: '#2e7d32',
    fontWeight: '500',
  },
});
