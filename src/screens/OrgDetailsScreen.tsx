import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  Linking,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AppHeader from '../components/AppHeader';
import Config from 'react-native-config';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Organization } from '../types/organization';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from "@react-navigation/native";



const API_URL = Config.API_URL;

type OrgDetailRouteProp = RouteProp<RootStackParamList, 'OrgDetail'>;

type Props = { route: OrgDetailRouteProp };

const MAX_CHARS = 160;

const ReplyItem = ({
  reply,
  level = 1,
}: {
  reply: any;
  level?: number;
}) => {
  const [collapsedThread, setCollapsedThread] = React.useState(true);
  const [collapsedText, setCollapsedText] = React.useState(true);

  const hasChildren = reply.children && reply.children.length > 0;
  const isLongText = reply.comment.length > MAX_CHARS;

  const displayText =
    collapsedText && isLongText
      ? reply.comment.slice(0, MAX_CHARS) + "…"
      : reply.comment;

  return (
    <View
      style={[
        styles.replyCard,
        { marginLeft: level * 16 },
      ]}
    >
      {/* 💬 COMMENT */}
      <Text style={styles.replyComment}>{displayText}</Text>

      {/* 🔽 EXPAND TEXT */}
      {isLongText && (
        <Pressable onPress={() => setCollapsedText(!collapsedText)}>
          <Text style={styles.toggleText}>
            {collapsedText ? "Δείτε περισσότερα" : "Λιγότερα"}
          </Text>
        </Pressable>
      )}

      {/* 👤 META */}
      <Text style={styles.replyMeta}>
        από {reply.user_name ?? "Anonymous"} ·{" "}
        {new Date(reply.created).toLocaleDateString("el-GR")}
      </Text>

      {/* 🔽 COLLAPSE THREAD */}
      {hasChildren && (
        <Pressable onPress={() => setCollapsedThread(!collapsedThread)}>
          <Text style={styles.toggleReplies}>
            {collapsedThread
              ? `▶ Δείτε απαντήσεις (${reply.children.length})`
              : "▼ Απόκρυψη απαντήσεων"}
          </Text>
        </Pressable>
      )}

      {/* 🔁 CHILD REPLIES */}
      {!collapsedThread && hasChildren && (
        <View>
          {reply.children.map((child: any) => (
            <ReplyItem
              key={child.id}
              reply={child}
              level={level + 1}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const OrgDetailScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation<any>();
  const { orgId } = route.params;
  const { user, token } = useAuth(); // ✅ get token here

  //const [user, setUser] = useState<any>(null);
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<Organization>(`${API_URL}/organizations/${orgId}/`, {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined, // 👈 allow anonymous
      })
      .then(res => {
        setOrg({
          ...res.data,
          reviews: res.data.reviews ?? [],
        });
      })
      .catch(err => {
        console.error(
          "Error fetching org:",
          err.response?.status,
          err.response?.data
        );
      })
      .finally(() => setLoading(false));
  }, [orgId, token]);

  if (!org) {
    return (
      <View style={styles.container}>
        <AppHeader user={user} loading={loading} />
        <View style={styles.center}>
          <Text>Organization not found</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader user={user} loading={loading} />
      <View style={styles.org_detail_container}>
        <ScrollView>
          {/* 🖼 IMAGE */}
          <Image
            source={{
              uri: org.images?.[0]?.image_url || 'https://picsum.photos/600/400',
            }}
            style={styles.image}
          />

          {/* 🏷 NAME */}
          <Text style={styles.name}>{org.name}</Text>

          {/* 📍 ADDRESS */}
          <Text style={styles.text}>📍 {org.address}</Text>

          {/* 📞 PHONE */}
          {org.phone && (
            <Pressable onPress={() => Linking.openURL(`tel:${org.phone}`)}>
              <Text style={styles.phone}>📞 {org.phone}</Text>
            </Pressable>
          )}
          {/* 📝 DESCRIPTION */}
          {org.description && (
            <Text style={styles.text}>{org.description}</Text>
          )}
          {/* 🌍 MAP LINK */}
          {org.latitude && org.longitude && (
            <Pressable
              style={styles.mapButton}
              onPress={() =>
                Linking.openURL(
                  `https://www.google.com/maps/search/?api=1&query=${org.latitude},${org.longitude}`
                )
              }
            >
              <Text style={styles.mapButtonText}>Χάρτης</Text>
            </Pressable>
          )}

          {/* ⭐ REVIEWS */}
          <View style={styles.reviewSection}>
            <Text style={styles.sectionTitle}>Σχόλια</Text>
            {user && (
              <Pressable
                style={styles.addReviewButton}
                onPress={() =>
                  navigation.navigate("Login", { orgId })
                }
              >
                <Text style={styles.addReviewText}>✍️ Άφησε το σχόλιο σου.</Text>
              </Pressable>
            ) || (
                <Text style={styles.loginHint}>
                  Συνδεθείτε για να αφήσετε το σχόλιο σας.
                </Text>
              )}
            {(!org.reviews || org.reviews.length === 0) && (
              <Text style={styles.empty}>Κανένα σχόλιο.</Text>
            )}

            {org.reviews?.map(review => (
              <View key={review.id} style={styles.reviewCard}>
                <Text style={styles.rating}>⭐ {review.rating}/5</Text>
                <Text style={styles.comment}>{review.comment}</Text>
                <Text style={styles.meta}>
                  από {review.user_name ?? "Anonymous"} ·{" "}
                  {new Date(review.created).toLocaleDateString("el-GR")}
                </Text>
                {/* 💬 REPLIES */}
                {review.replies && review.replies.length > 0 && (
                  <View style={styles.replyContainer}>
                    {review.replies.map(reply => (
                      <ReplyItem
                        key={reply.id}
                        reply={reply}
                        level={1}
                      />
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

// const HEADER_HEIGHT = 95; // same as AppHeader

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff4500',
  },
  org_detail_container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
    color: '#1F2937',
  },
  phone: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 8,
  },
  mapButton: {
    backgroundColor: '#FF4500',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  mapButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  reviewSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  empty: {
    color: "#888",
    fontStyle: "italic",
  },

  reviewCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },

  rating: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },

  comment: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
  },

  meta: {
    fontSize: 12,
    color: "#888",
    textTransform: "capitalize",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  addReviewButton: {
    backgroundColor: "#34d399",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  addReviewText: {
    color: "#fff",
    fontWeight: "600",
  },

  loginHint: {
    color: "#777",
    marginVertical: 6,
    fontSize: 13,
  },

  replyContainer: {
    marginTop: 8,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: "#ddd",
  },

  replyCard: {
    marginTop: 6,
    padding: 8,
    backgroundColor: "#dcdcdc",
    borderRadius: 6,
  },

  replyComment: {
    fontSize: 14,
    color: "#333",
  },

  replyMeta: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
  toggleText: {
    color: "#007AFF",
    fontSize: 13,
    marginBottom: 4,
  },
  toggleReplies: {
    color: "#007AFF",
    fontSize: 13,
    marginTop: 6,
  },
});

export default OrgDetailScreen;


