import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from "react-native";
import debounce from "lodash.debounce";
import { SafeAreaView } from "react-native-safe-area-context";
import Config from "react-native-config";
import AppHeader from '../components/AppHeader';


const API_URL = Config.API_URL;

type Organization = {
  id: number;
  name: string;
  category: string;
  phone: string;
  address: string;
  description?: string;
};

const SearchScreen = ({ navigation }: any) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔍 API call
  const fetchResults = async (text: string) => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/api/organizations?search=${text}`
      );
      const data = await res.json();

      setResults(data);
    } catch (error) {
      console.log("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ⚡ Debounce
  const debouncedSearch = useCallback(
    debounce((text: string) => {
      if (text.length > 2) {
        fetchResults(text);
      } else {
        setResults([]);
      }
    }, 400),
    []
  );

  // handle input
  const handleChange = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  // cleanup debounce
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  // render item
  const renderItem = ({ item }: { item: Organization }) => (
    <Pressable
      style={styles.card}
      onPress={() =>
        navigation.navigate("HomeStack", {
          screen: "OrgDetails",
          params: { id: item.id },
        })
      }
    >
      <Text style={styles.name}>{item.name}</Text>

      <Text style={styles.category}>{item.category}</Text>

      {item.address && (
        <Text style={styles.info}>📍 {item.address}</Text>
      )}

      {item.phone && (
        <Text style={styles.info}>📞 {item.phone}</Text>
      )}

      {item.description && (
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      )}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader loading={loading} />
      <View style={styles.container}>
        {/* 🔍 Search Input */}
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Αναζήτηση επιχείρησεις ή κατηγορίας..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={handleChange}
            autoFocus
            style={styles.input}
          />

          {query.length > 0 && (
            <Pressable onPress={() => { setQuery(""); setResults([]); }}>
              <Text style={styles.clear}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* ⏳ Loading */}
        {loading && <ActivityIndicator style={{ marginTop: 20 }} />}

        {/* 📭 Empty State */}
        {!loading && query.length > 2 && results.length === 0 && (
          <Text style={styles.empty}>Δεν βρέθηκαν αποτελέσματα</Text>
        )}

        {/* 📋 Results */}
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 8,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    paddingHorizontal: 12,
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },

  clear: {
    fontSize: 18,
    color: "#888",
  },

  item: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
  },

  category: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },

  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 6,
    marginTop: 12,

    // shadow (iOS)
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },

    // elevation (Android)
    elevation: 2,
  },

  info: {
    fontSize: 13,
    color: "#444",
    marginTop: 4,
  },

  description: {
    fontSize: 13,
    color: "#777",
    marginTop: 6,
  },
});

export default SearchScreen;