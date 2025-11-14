import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { apiService, Friendship, User } from '@/services/api';

export default function FriendsScreen() {
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [friendshipsData, usersData] = await Promise.all([
        apiService.getFriendships(),
        apiService.getUsers(),
      ]);
      setFriendships(friendshipsData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (userId: number) => {
    try {
      await apiService.createFriendship(userId);
      loadData();
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const acceptedFriends = friendships.filter(f => f.status === 'accepted');

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Friends</ThemedText>
      </ThemedView>
      <ScrollView style={styles.scrollView}>
        {loading ? (
          <ThemedText>Loading...</ThemedText>
        ) : (
          <>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              My Friends ({acceptedFriends.length})
            </ThemedText>
            {acceptedFriends.length === 0 ? (
              <ThemedText style={styles.emptyText}>No friends yet</ThemedText>
            ) : (
              acceptedFriends.map((friendship) => (
                <ThemedView key={friendship.id} style={styles.friendCard}>
                  <ThemedText>{friendship.addressee.username}</ThemedText>
                </ThemedView>
              ))
            )}
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Discover Users
            </ThemedText>
            {users.map((user) => (
              <ThemedView key={user.id} style={styles.userCard}>
                <ThemedText>{user.username}</ThemedText>
                <TouchableOpacity
                  onPress={() => handleAddFriend(user.id)}
                  style={styles.addButton}
                >
                  <ThemedText style={styles.addButtonText}>Add Friend</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            ))}
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    padding: 16,
    paddingBottom: 8,
  },
  friendCard: {
    padding: 16,
    margin: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    margin: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  emptyText: {
    padding: 16,
    opacity: 0.6,
  },
});

