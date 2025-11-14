import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { apiService, FoodStatus } from '@/services/api';

export default function FoodStatusScreen() {
  const [statuses, setStatuses] = useState<FoodStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatuses();
  }, []);

  const loadStatuses = async () => {
    try {
      const data = await apiService.getFoodStatuses();
      setStatuses(data);
    } catch (error) {
      console.error('Error loading food statuses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStatus = async () => {
    // Placeholder for creating a new food status
    try {
      await apiService.createFoodStatus({
        content: 'Just had an amazing meal! 🍽️',
        visibility: 'friends',
      });
      loadStatuses();
    } catch (error) {
      console.error('Error creating food status:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Food Status</ThemedText>
        <TouchableOpacity
          onPress={handleCreateStatus}
          style={styles.addButton}
        >
          <ThemedText style={styles.addButtonText}>+ New Status</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <ScrollView style={styles.scrollView}>
        {loading ? (
          <ThemedText>Loading...</ThemedText>
        ) : statuses.length === 0 ? (
          <ThemedText>No food statuses yet. Share what you're eating!</ThemedText>
        ) : (
          statuses.map((status) => (
            <ThemedView key={status.id} style={styles.statusCard}>
              <ThemedText type="subtitle">{status.author.username}</ThemedText>
              <ThemedText style={styles.content}>{status.content}</ThemedText>
              <ThemedText style={styles.timestamp}>
                {new Date(status.created_at).toLocaleString()}
              </ThemedText>
            </ThemedView>
          ))
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  statusCard: {
    padding: 16,
    margin: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  content: {
    marginTop: 8,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.6,
  },
});

