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
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { Organization } from "../types/organization";

const API_URL = Config.API_URL;


const SearchScreen = ({ navigation }: any) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [org, setOrg] = useState<Organization | null>(null);

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
        navigation.navigate("OrgDetail", { orgId: item.id })
      }
    >
      <View style={styles.headerRow}>
        <Text style={styles.orgName} numberOfLines={1}>
          {item.name}
        </Text>

        <View style={styles.ratingRow}>
          <MaterialIcons
            name="star"
            size={14}
            color="#f59e0b"
            style={styles.star}
          />
          <Text style={styles.ratingText}>
            {item.average_rating?.toFixed(1) ?? '0.0'}
          </Text>
        </View>
      </View>



      {/* <Text style={styles.category}>
        Κατηγορία: {item.organization_type?.name || "Καμία κατηγορία..."}
      </Text> */}


      <View style={styles.middleRow}>
        <View style={styles.addressRow}>
          {item.address && (
            <Text style={styles.orgAddress}>
              <MaterialIcons name="location-on" style={styles.location} size={14} color="#e53e3e" />
              {item.address ?? '-'}</Text>
          )}
        </View>
        {item.reviews && (
          <Text style={styles.comments}>
            ({item.reviews?.length ?? 0}) Αξιολογήσεις</Text>
        )}
      </View>

      <View style={styles.footerRow}>
        <View style={styles.phoneRow}>
          {item.phone && (
            <Text style={styles.orgPhone}>
              <MaterialIcons name="phone" size={14} color="#38a169" />
              {item.phone ?? '-'}
            </Text>
          )}
        </View>
      </View>
      {/* {item.email ? (
        <Text style={styles.info}>
          <MaterialIcons name="email" size={14} color="#3182ce" />
          {item.email}
        </Text>
      ) : (
        <Text style={styles.info}>No email available</Text>
      )}

      {item.description && (
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      )} */}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader loading={loading} />
      <View style={styles.container}>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
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

        {/* Loading */}
        {loading && <ActivityIndicator style={{ marginTop: 20 }} />}

        {!loading && query.length > 2 && results.length === 0 && (
          <Text style={styles.empty}>Δεν βρέθηκαν αποτελέσματα</Text>
        )}

        {/* Results */}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  orgName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
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



  description: {
    fontSize: 13,
    color: "#777",
    marginTop: 6,
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 4,
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
  orgAddress: {
    fontSize: 14,
    color: '#1a202c',
    marginRight: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  orgPhone: {
    fontSize: 14,
    color: '#1a202c',
  },
  location: {
    marginRight: 4,
  },
  comments: {
    fontSize: 12,
    color: '#718096',
  },
});

export default SearchScreen;