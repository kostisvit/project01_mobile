import React from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";

const { width } = Dimensions.get("window");

const OrgImagesScreen = ({ route }: any) => {
  const { images = [] } = route.params ?? {};
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader loading={!user} />

      <View style={styles.imgContainer}>
        {images.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Δεν υπάρχουν διαθέσιμες φωτογρφαίες.
            </Text>
          </View>
        ) : (
          <FlatList
            data={images}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item.image_url }}
                style={styles.image}
                resizeMode="cover"
              />
            )}
            ItemSeparatorComponent={() => (
              <View style={styles.separator} />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default OrgImagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 12,
  },

  imgContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },

  listContent: {
    padding: 3,
  },

  image: {
    width: "100%",
    height: width * 0.7,
    borderRadius: 12,
  },

  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  emptyText: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
  },
});
