import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  Linking,
  StyleSheet,
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
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { ActivityIndicator } from 'react-native';
import type { OrgCardProps } from '../types/organization';

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
      <Text style={styles.replyComment}>{displayText}</Text>


      {isLongText && (
        <Pressable onPress={() => setCollapsedText(!collapsedText)}>
          <Text style={styles.toggleText}>
            {collapsedText ? "Δείτε περισσότερα" : "Λιγότερα"}
          </Text>
        </Pressable>
      )}
      <Text style={styles.replyMeta}>
        από {reply.user_name ?? "Anonymous"} ·{" "}
        {new Date(reply.created).toLocaleDateString("el-GR")}
      </Text>

      {hasChildren && (
        <Pressable onPress={() => setCollapsedThread(!collapsedThread)}>
          <Text style={styles.toggleReplies}>
            {collapsedThread
              ? `▶ Δείτε απαντήσεις (${reply.children.length})`
              : "▼ Απόκρυψη απαντήσεων"}
          </Text>
        </Pressable>
      )}
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
  const { user, token } = useAuth();
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const isOpen = org?.open_status;

  useEffect(() => {
    axios
      .get<Organization>(`${API_URL}/organizations/${orgId}/`, {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
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
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF4500" />
      </View>
    );
  }
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
              ({org.reviews?.length ?? 0}) Αξιολογήσεις
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
              {isOpen ? 'Ανοιχτά' : 'Κλειστά'}
            </Text>
          </View>
          {org.description && (
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionTitle}>Σχετικά</Text>
              <Text style={styles.descriptionText}>
                {org.description}
              </Text>
            </View>
          )}
          <View style={styles.mapCard}>
            <Pressable
              style={styles.mapButton}
              onPress={() =>
                Linking.openURL(
                  `https://www.google.com/maps/search/?api=1&query=${org.latitude},${org.longitude}`
                )
              }
            >
              <MaterialIcons name="map" size={18} color="#fff" />
              <Text style={styles.mapButtonText}>Άνοιγμα στο Χάρτη</Text>
            </Pressable>
          </View>

          {/* ⭐ REVIEWS */}
          <View style={styles.reviewSection}>
            <Text style={styles.sectionTitle}>Σχόλια</Text>
            {user ? (
              <Pressable
                style={styles.addReviewButton}
                onPress={() => navigation.navigate("Login", { orgId })}
              >
                <Text style={styles.addReviewText}>✍️ Άφησε το σχόλιο σου.</Text>
              </Pressable>
            ) : (
              <Text
                style={styles.loginHint}
                onPress={() => navigation.navigate('Login')}
              >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
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
  mapCard: {
    marginTop: 14
  },

  mapButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FF4500',
    padding: 12,
    borderRadius: 10
  },
  mapButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  reviewSection: {
    marginTop: 24,
    backgroundColor: "#f0f4f8",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    marginLeft: 5,
    marginTop: 8,
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
  ratingText: {
    fontSize: 14,
    color: '#1a202c',
  },
  rating: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  star: {
    marginRight: 4,
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
  orgAddress: {
    fontSize: 14,
    color: '#1a202c',
    marginLeft: 4,
  },
  comment: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
  },
  comments: {
    fontSize: 12,
    color: '#718096',
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
    textDecorationLine: 'underline',
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
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  toggleReplies: {
    color: "#007AFF",
    fontSize: 13,
    marginTop: 6,
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
  descriptionBox: {
    marginTop: 14,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
  },

  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },

  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
});

export default OrgDetailScreen;


