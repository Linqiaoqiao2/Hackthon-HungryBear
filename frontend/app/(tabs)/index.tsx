import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, Image, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { apiService, Recipe } from '@/services/api';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await apiService.getRecipes();
      console.log('Loaded recipes:', data);
      console.log('Number of recipes:', data.length);
      setRecipes(data);
    } catch (error: any) {
      console.error('Error loading recipes:', error);
      setError(error.message || 'Failed to load recipes');
      setRecipes([]); // Ensure recipes is empty on error
    } finally {
      setLoading(false);
    }
  };

  // Mock stories data - you can replace this with actual API call
  const stories = Array.from({ length: 6 }, (_, i) => ({ id: i }));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Stories Section */}
      <View style={styles.storiesSection}>
        <ThemedText style={styles.sectionTitle}>Stories</ThemedText>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.storiesScroll}
          contentContainerStyle={styles.storiesContent}
        >
          {stories.map((story, index) => (
            <TouchableOpacity
              key={story.id}
              style={styles.storyCircle}
            >
              {index === 0 ? (
                <ThemedText style={styles.addStoryIcon}>+</ThemedText>
              ) : (
                <View style={styles.storyPlaceholder} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
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
                onPress={() => router.push(`/recipe/${recipe.id}`)}
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
                  <ThemedText style={styles.recipeTitle} numberOfLines={1} lightColor="#000" darkColor="#000">
                    {recipe.title}
                  </ThemedText>
                  <View style={styles.recipeAuthor}>
                    <View style={styles.authorAvatar} />
                    <ThemedText style={[styles.authorName, { marginLeft: 6 }]} numberOfLines={1} lightColor="#666" darkColor="#666">
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  },
  // Recipes Section
  recipesSection: {
    backgroundColor: '#DAA520', // Mustard yellow
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
    minHeight: 400,
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
    maxWidth: CARD_WIDTH,
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
  recipeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    minHeight: 20,
  },
  recipeAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  authorName: {
    fontSize: 12,
    color: '#666',
    flex: 1,
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
