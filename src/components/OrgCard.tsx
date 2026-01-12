import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';

type OrgCardProps = {
  org: any; // replace with proper type if you have one
  width: number;
  onPress: () => void;
};

export const OrgCard: React.FC<OrgCardProps> = ({
  org,
  width,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
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
          <Text style={styles.orgName}>{org.name}</Text>

          {org.phone && (
            <Text style={styles.orgPhone}>📞 {org.phone}</Text>
          )}

          {org.address && (
            <Text style={styles.orgAddress}>🏠 {org.address}</Text>
          )}
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
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4, // android shadow
    shadowColor: '#000', // ios shadow
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginTop: 5,
  },
  cardImage: {
    height: 180,
    width: '100%',
  },
  infoContainer: {
    padding: 12,
  },
  orgName: {
    fontSize: 18,
    fontWeight: '600',
  },
  orgPhone: {
    marginTop: 4,
    color: '#555',
  },
  orgAddress: {
    marginTop: 2,
    color: '#555',
  },
});
