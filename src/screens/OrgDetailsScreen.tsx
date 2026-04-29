import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  Linking,
  StyleSheet,
  Modal,
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
import { OrgHour } from '../types/organization';


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
  const isOpen = org?.status_info?.is_open;
  const message = org?.status_info?.message;
  const [hoursModalVisible, setHoursModalVisible] = React.useState(false);
  const [showDescriptionModalVisible, setDescriptionModalVisible] = React.useState(false);

  const groupedHours = React.useMemo(() => {
    if (!org?.hours) return {};

    const map: Record<string, string[]> = {};

    org.hours.forEach((h) => {
      const timeRange = h.close ? `${h.open}-${h.close}` : 'Κλειστό';

      if (!map[h.day]) {
        map[h.day] = [];
      }

      map[h.day].push(timeRange);
    });

    return map;
  }, [org]);


  useEffect(() => {
    axios
      .get<Organization>(`${API_URL}api/organizations/${orgId}/`, {
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
          <Pressable
            onPress={() =>
              navigation.navigate("OrgPhotos", {
                images: org.images,
              })
            }
          >
            <Image
              source={{
                uri:
                  org.images?.[0]?.image_url ||
                  "https://picsum.photos/600/400",
              }}
              style={styles.image}
            />
          </Pressable>

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
            <Pressable onPress={() => setHoursModalVisible(true)}>
              <Text style={[isOpen ? styles.statusOpen : styles.statusClosed, { textDecorationLine: 'underline' }]}>
                {message}
              </Text>
            </Pressable>

          </View>
          {org.description && (
            <Pressable onPress={() => setDescriptionModalVisible(true)}>
              <View style={styles.descriptionBox}>
                <Text style={styles.descriptionTitle}>Σχετικά</Text>
                <Text style={styles.descriptionText} numberOfLines={2}>
                  {org.description}
                </Text>
              </View>
            </Pressable>
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

          <View style={styles.reviewSection}>
            <Text style={styles.sectionTitle}>Σχόλια</Text>
            {user ? (
              <Pressable
                style={styles.addReviewButton}
                onPress={() => navigation.navigate("AddReview", { orgId: org.id })}
              >
                <View style={styles.buttonContent}>
                  <MaterialIcons name="comment" color="#fff" size={18} />
                  <Text style={styles.addReviewText}>
                    Άφησε το σχόλιο σου
                  </Text>
                </View>
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
                <Text style={styles.rating}>
                  <MaterialIcons name="star" size={18} color="gold" />
                  {org.average_rating?.toFixed(1) ?? '0.0'}</Text>
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
        <Modal
          visible={hoursModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setHoursModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Ώρες Λειτουργίας</Text>

              {!org ? (
                <ActivityIndicator />
              ) : (
                Object.entries(groupedHours).map(([day, times]) => (
                  <View key={day} style={styles.row}>
                    <Text style={styles.day}>{day}</Text>
                    <Text style={styles.time}>
                      {times.length ? times.join(', ') : 'Κλειστό'}
                    </Text>
                  </View>
                ))
              )}

              <Pressable
                style={styles.closeButton}
                onPress={() => setHoursModalVisible(false)}
              >
                <Text style={styles.closeText}>Κλείσιμο</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showDescriptionModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setDescriptionModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.descriptionText}>
                {org.description}
              </Text>

              <Pressable
                style={styles.closeButton}
                onPress={() => setDescriptionModalVisible(false)}
              >
                <Text style={styles.closeText}>Κλείσιμο</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
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
    marginTop: 14,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#333",
    marginBottom: 10,
    marginLeft: 5,
    marginTop: 8,
  },

  empty: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 10,
  },

  reviewCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  addReviewText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
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
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#b45309',
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
    lineHeight: 20,
    color: '#333',
    marginTop: 6,
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FF4500',
    padding: 12,
    borderRadius: 10
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6, // 👈 clean spacing (RN 0.71+)
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
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 10,
    marginTop: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#e5e7eb',
  },
  replyComment: {
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
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
    color: '#6b7280',
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  day: {
    fontWeight: '600',
  },

  time: {
    color: '#444',
  },

  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },

  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default OrgDetailScreen;


