import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { apiService, Recipe, User } from '@/services/api';
import { mockUsers, mockRecipes } from '@/services/mockData';

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadUserData();
    loadRecipes();
  }, []);

  const loadUserData = async () => {
    try {
      setError(null);
      setLoading(true);
      // Note: This is a placeholder. In a real app, you'd get the current authenticated user
      // For now, we'll fetch the first user as a demo
      const users = await apiService.getUsers();
      if (users.length > 0) {
        setUser(users[0]);
      } else if (__DEV__) {
        // Fallback to mock user in development
        console.log('Using mock user as fallback');
        setUser(mockUsers[0]);
      }
    } catch (error: any) {
      console.error('Error loading user data:', error);
      setError(error.message || 'Failed to load user data');
      // Fallback to mock user in development mode when API fails
      if (__DEV__) {
        console.log('Using mock user as fallback');
        setUser(mockUsers[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadRecipes = async () => {
    try {
      setRecipesLoading(true);
      const data = await apiService.getRecipes();
      // Filter recipes by the current user if available
      // For now, show all recipes since we don't have current user context
      // Use API data if available, otherwise fallback to mock data
      setRecipes(data.length > 0 ? data : mockRecipes);
    } catch (error: any) {
      console.error('Error loading recipes:', error);
      // Fallback to mock data in development mode when API fails
      if (__DEV__) {
        console.log('Using mock recipes as fallback');
        setRecipes(mockRecipes);
      } else {
        setRecipes([]);
      }
    } finally {
      setRecipesLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Profile</ThemedText>
      </ThemedView>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.profileCard}>
          <ThemedText type="subtitle">User Profile</ThemedText>
          {loading ? (
            <ThemedText style={styles.info}>Loading user data...</ThemedText>
          ) : user ? (
            <>
              <ThemedText style={styles.info}>Username: {user.username}</ThemedText>
              <ThemedText style={styles.info}>Email: {user.email || 'N/A'}</ThemedText>
              {user.first_name || user.last_name ? (
                <ThemedText style={styles.info}>
                  Name: {[user.first_name, user.last_name].filter(Boolean).join(' ') || 'N/A'}
                </ThemedText>
              ) : null}
            </>
          ) : (
            <ThemedText style={styles.info}>
              User profile requires authentication. Please log in to view your profile.
            </ThemedText>
          )}
        </ThemedView>
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">My Recipes</ThemedText>
          {recipesLoading ? (
            <ThemedText style={styles.emptyText}>Loading recipes...</ThemedText>
          ) : recipes.length === 0 ? (
            <ThemedText style={styles.emptyText}>No recipes yet. Create your first recipe!</ThemedText>
          ) : (
            <View style={styles.recipesList}>
              {recipes.map((recipe) => (
                <TouchableOpacity
                  key={recipe.id}
                  style={styles.recipeItem}
                  onPress={() => router.push(`/recipeDetail/${recipe.id}`)}
                >
                  {recipe.image_url ? (
                    <Image 
                      source={{ uri: recipe.image_url }} 
                      style={styles.recipeThumbnail}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.recipeThumbnailPlaceholder}>
                      <ThemedText style={styles.recipeThumbnailText}>No Image</ThemedText>
                    </View>
                  )}
                  <View style={styles.recipeInfo}>
                    <ThemedText style={styles.recipeTitle}>{recipe.title}</ThemedText>
                    <ThemedText style={styles.recipeMeta}>
                      {new Date(recipe.created_at).toLocaleDateString()}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ThemedView>
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
  profileCard: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  info: {
    marginTop: 8,
  },
  section: {
    padding: 16,
  },
  emptyText: {
    marginTop: 8,
    opacity: 0.6,
  },
  recipesList: {
    marginTop: 8,
  },
  recipeItem: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  recipeThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  recipeThumbnailPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recipeThumbnailText: {
    fontSize: 10,
    color: '#999',
  },
  recipeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  recipeMeta: {
    fontSize: 12,
    opacity: 0.6,
  },
});

