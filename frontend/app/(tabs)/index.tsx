import { ThemedText } from '@/components/themed-text';
import { apiService, FoodStatus, Recipe } from '@/services/api';
import { mockRecipes, mockStories } from '@/services/mockData';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding (16px padding on each side + 16px gap)

// Helper function to calculate card width more accurately
const getCardWidth = () => {
  const screenWidth = Dimensions.get('window').width;
  const padding = 16 * 2; // left and right padding
  const gap = 16; // gap between cards
  return (screenWidth - padding - gap) / 2;
};
export default function FeedScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [stories, setStories] = useState<FoodStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [storiesLoading, setStoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storiesError, setStoriesError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadRecipes();
    loadStories();
  }, []);

  const loadRecipes = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await apiService.getRecipes();
      console.log('Loaded recipes:', data);
      console.log('Number of recipes:', data.length);
      // Use API data if available and not empty, otherwise fallback to mock data
      if (data && data.length > 0) {
        // Sort by created_at descending (newest first)
        const sortedData = [...data].sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setRecipes(sortedData);
      } else {
        console.log('API returned empty data, using mock recipes as fallback');
        // Sort mock data by date descending
        const sortedMock = [...mockRecipes].sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setRecipes(sortedMock);
      }
    } catch (error: any) {
      // Silently fallback to mock data without showing error to user
      console.log('API error (using mock recipes as fallback):', error.message);
      setError(null); // Don't set error, just use mock data
      // Sort mock data by date descending
      const sortedMock = [...mockRecipes].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setRecipes(sortedMock);
    } finally {
      setLoading(false);
    }
  };

  const loadStories = async () => {
    try {
      setStoriesError(null);
      setStoriesLoading(true);
      const data = await apiService.getFoodStatuses();
      console.log('Loaded stories:', data);
      // Use API data if available and not empty, otherwise fallback to mock data
      if (data && data.length > 0) {
        setStories(data);
      } else {
        console.log('API returned empty data, using mock stories as fallback');
        setStories(mockStories);
      }
    } catch (error: any) {
      // Silently fallback to mock data without showing error to user
      console.log('API error (using mock stories as fallback):', error.message);
      setStoriesError(null); // Don't set error, just use mock data
      setStories(mockStories);
    } finally {
      setStoriesLoading(false);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={false}
      >
        {/* Stories Section */}
        <View style={styles.storiesSection}>
          <ThemedText style={styles.sectionTitle}>Stories</ThemedText>
          {storiesLoading ? (
            <ThemedText style={styles.loadingText}>Loading stories...</ThemedText>
          ) : stories.length === 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.storiesScroll}
              contentContainerStyle={styles.storiesContent}
            >
              <TouchableOpacity style={styles.storyCircle}>
                <ThemedText style={styles.addStoryIcon}>+</ThemedText>
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.storiesScroll}
              contentContainerStyle={styles.storiesContent}
            >
              <TouchableOpacity style={styles.storyCircle}>
                <ThemedText style={styles.addStoryIcon}>+</ThemedText>
              </TouchableOpacity>
              {stories.map((story) => (
                <TouchableOpacity
                  key={story.id}
                  style={styles.storyCircle}
                >
                  {story.image_url ? (
                    <Image
                      source={{ uri: story.image_url }}
                      style={styles.storyImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.storyPlaceholder}>
                      <ThemedText style={styles.storyInitial}>
                        {story.author?.username?.charAt(0).toUpperCase() || '?'}
                      </ThemedText>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Recipes Section */}
        <View style={styles.recipesSection}>
          <ThemedText style={styles.sectionTitle}>Recipes</ThemedText>
          {loading ? (
            <ThemedText style={styles.loadingText}>Loading...</ThemedText>
          ) : error ? (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
              <TouchableOpacity onPress={loadRecipes} style={styles.retryButton}>
                <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
              </TouchableOpacity>
            </View>
          ) : recipes.length === 0 ? (
            <ThemedText style={styles.emptyText}>No recipes yet. Create your first recipe!</ThemedText>
          ) : (
            <View style={styles.recipesGrid}>
              {recipes.map((recipe) => (
                <TouchableOpacity
                  key={recipe.id}
                  style={styles.recipeCard}
                  onPress={() => router.push(`/recipeDetail/${recipe.id}`)}
                  activeOpacity={0.7}
                >
                  {recipe.image_url ? (
                    <Image
                      source={{ uri: recipe.image_url }}
                      style={styles.recipeImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.recipeImagePlaceholder}>
                      <ThemedText style={styles.placeholderText}>No Image</ThemedText>
                    </View>
                  )}
                  <View style={styles.recipeCardContent}>
                    <View style={styles.recipeHeader}>
                      <ThemedText style={styles.recipeTitle} numberOfLines={1} lightColor="#000" darkColor="#000">
                        {recipe.title}
                      </ThemedText>
                      <ThemedText style={styles.recipeDate} lightColor="#666" darkColor="#666">
                        {new Date(recipe.created_at).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        }).replace(/\./g, '/')}
                      </ThemedText>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.recipeAuthorRow}>
                      <View style={styles.authorAvatar}>
                        <ThemedText style={styles.avatarText}>
                          {recipe.author.username.charAt(0).toUpperCase()}
                        </ThemedText>
                      </View>
                      <ThemedText style={styles.authorName} lightColor="#000" darkColor="#000">
                        {recipe.author.username}
                      </ThemedText>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#DAA520', // Yellow background for the entire screen
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#DAA520', // Ensure container also has yellow background
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#DAA520', // Yellow background extends with content
    minHeight: '100%', // Ensure minimum height to fill screen
    paddingBottom: 100, // Extra padding at bottom to ensure yellow background shows
  },
  // Stories Section
  storiesSection: {
    backgroundColor: '#2C5F5F', // Dark teal/green
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  storiesScroll: {
    marginHorizontal: -16,
  },
  storiesContent: {
    paddingHorizontal: 16,
  },
  storyCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addStoryIcon: {
    fontSize: 32,
    color: '#666',
    fontWeight: '300',
  },
  storyPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  storyInitial: {
    fontSize: 24,
    fontWeight: '600',
    color: '#666',
  },
  // Recipes Section
  recipesSection: {
    backgroundColor: '#DAA520', // Mustard yellow
    paddingTop: 20,
    paddingBottom: 40, // Increased bottom padding for better scrolling
    paddingHorizontal: 16,
    flexGrow: 1, // Allow section to grow with content
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  recipesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
    width: '100%',
  },
  recipeCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  recipeImage: {
    width: '100%',
    height: CARD_WIDTH * 0.75,
    backgroundColor: '#f0f0f0',
  },
  recipeImagePlaceholder: {
    width: '100%',
    height: CARD_WIDTH * 0.75,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#999',
  },
  recipeCardContent: {
    padding: 12,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  recipeDate: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 8,
  },
  recipeAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  errorContainer: {
    padding: 16,
    margin: 16,
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: '#FFEBEB',
  },
  errorText: {
    color: '#c62828',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

