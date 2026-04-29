import React from "react";
import { View, FlatList, Image, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from "../components/AppHeader";
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get("window");

const OrgImagesScreen = ({ route }: any) => {
  const { images } = route.params;
  const { user, token } = useAuth();


  return (
    <SafeAreaView style={styles.container}>
      <AppHeader user={user} />
      <View style={styles.img_container}>
        <FlatList
          data={images}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.img_container}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item.image_url }}
              style={styles.image}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      </View>
    </SafeAreaView>
  );
};

export default OrgImagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 12,
  },
  img_container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 3,

  },
  image: {
    width: "100%",
    height: width * 0.7,
    borderRadius: 12,
  },
});