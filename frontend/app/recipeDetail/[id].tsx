import { ThemedText } from '@/components/themed-text';
import { apiService, Recipe } from '@/services/api';
import { mockRecipes } from '@/services/mockData';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [story, setStory] = useState('');
  const [cookDetails, setCookDetails] = useState('');

  const loadRecipe = useCallback(async (recipeId: number) => {
    try {
      setLoading(true);
      const data = await apiService.getRecipe(recipeId);
      setRecipe(data);
      // Initialize story and cook details if needed (these might come from the API in the future)
      setStory('This is a delicious recipe that has been passed down through generations...');
      setCookDetails('Cook for 15 minutes at 200°C until golden brown.');
    } catch (error: any) {
      console.error('Error loading recipe:', error);
      setError(error.message || 'Failed to load recipe');
      // Fallback to mock data in development mode when API fails
      if (__DEV__) {
        const mockRecipe = mockRecipes.find(r => r.id === recipeId);
        if (mockRecipe) {
          console.log('Using mock recipe as fallback');
          setRecipe(mockRecipe);
          setStory('This is a delicious recipe that has been passed down through generations...');
          setCookDetails('Cook for 15 minutes at 200°C until golden brown.');
          setError(null);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      const recipeId = parseInt(id, 10);
      if (!isNaN(recipeId)) {
        loadRecipe(recipeId);
      } else {
        setLoading(false);
      }
    }
  }, [id, loadRecipe]);

  if (loading) {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity
            onPress={() => {
              if (id) {
                const recipeId = parseInt(id, 10);
                if (!isNaN(recipeId)) {
                  loadRecipe(recipeId);
                }
              }
            }}
            style={styles.retryButton}
          >
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.loadingContainer}>
          <ThemedText>Recipe not found</ThemedText>
        </View>
      </View>
    );
  }

  // Parse ingredients into array - support both newline and comma separators
  const ingredientsList = recipe.ingredients
    ? recipe.ingredients
      .split(/\n|,/)
      .map(item => item.trim())
      .filter(item => item.length > 0)
    : [];

  // Parse instructions into steps
  const stepsList = recipe.instructions?.split('\n').filter(step => step.trim()) || [];

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Generate step images based on step index and recipe
  const getStepImageUrl = (stepIndex: number, totalSteps: number) => {
    // Use Unsplash curated food images for variety
    // Different image IDs for different steps to show variety
    const imageIds = [
      '1513104890138-7c749659a591', // cooking prep
      '1555939594-58d7cb561ad1',   // ingredients
      '1484723091739-30a097e8f929', // mixing
      '1568901346375-23c9450c58cd', // cooking
      '1541519227354-08fa5d50c44d', // plating
      '1579584425555-c3ce17fd4351', // garnishing
      '1512621776951-a57141f2eefd', // final dish
      '1504674900247-0877df9cc836', // baking
    ];

    const imageId = imageIds[stepIndex % imageIds.length] || imageIds[0];
    return `https://images.unsplash.com/photo-${imageId}?w=400&h=300&fit=crop&auto=format`;
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Recipe Image */}
        <View style={styles.imageContainer}>
          {recipe.image_url ? (
            <Image
              source={{ uri: recipe.image_url }}
              style={styles.mainImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <ThemedText style={styles.placeholderIcon}>🏔️☀️</ThemedText>
            </View>
          )}
        </View>

        {/* Content Section - Yellow-Orange Background */}
        <View style={styles.contentSection}>
          {/* Name of recipe with author */}
          <View style={styles.recipeHeader}>
            <View style={styles.recipeTitleRow}>
              <ThemedText style={styles.recipeTitle}>{recipe.title}</ThemedText>
              <View style={styles.authorRow}>
                <View style={styles.authorAvatar} />
                <ThemedText style={styles.authorName}>{recipe.author?.username || 'Unknown'}</ThemedText>
              </View>
            </View>
          </View>

          {/* Story behind this Dish */}
          <View style={styles.inputSection}>
            <ThemedText style={styles.sectionLabel}>Story behind this Dish</ThemedText>
            <View style={styles.textDisplay}>
              <ThemedText style={styles.textDisplayContent}>{story}</ThemedText>
            </View>
          </View>

          {/* Ingredients */}
          <View style={styles.ingredientsSection}>
            <ThemedText style={styles.sectionLabel}>Ingredients</ThemedText>
            {ingredientsList.length > 0 ? (
              <View style={styles.ingredientsContainer}>
                {ingredientsList.map((ingredient, index) => {
                  const parts = ingredient.split(':');
                  const name = parts[0]?.trim() || ingredient;
                  const amount = parts[1]?.trim() || '';
                  const isLast = index === ingredientsList.length - 1;
                  return (
                    <View key={`ingredient-${index}`}>
                      <View style={styles.ingredientRow}>
                        <ThemedText style={styles.ingredientText}>
                          {`${name}${amount ? `: ${amount}` : ''}`}
                        </ThemedText>
                      </View>
                      {!isLast && <View style={styles.ingredientSeparator} />}
                    </View>
                  );
                })}
              </View>
            ) : (
              <ThemedText style={styles.emptyText}>No ingredients listed</ThemedText>
            )}
          </View>

          {/* Steps */}
          {stepsList.length > 0 ? (
            stepsList.map((step, index) => {
              const stepImageUrl = getStepImageUrl(index, stepsList.length);
              return (
                <View key={`step-${index}`} style={styles.stepSection}>
                  <ThemedText style={styles.sectionLabel}>{index + 1}. step</ThemedText>
                  <View style={styles.stepImageContainer}>
                    <Image
                      source={{ uri: stepImageUrl }}
                      style={styles.stepImage}
                      resizeMode="cover"
                    />
                  </View>
                  {index === 0 && (
                    <View style={styles.cookDetailsSection}>
                      <View style={styles.textDisplay}>
                        <ThemedText style={styles.textDisplayContent}>{cookDetails}</ThemedText>
                      </View>
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <View style={styles.stepSection}>
              <ThemedText style={styles.emptyText}>No steps listed</ThemedText>
            </View>
          )}

          {/* Updated date */}
          <View style={styles.dateRow}>
            <ThemedText style={styles.dateText}>
              Updated on {formatDate(recipe.updated_at)}
            </ThemedText>
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <ThemedText style={styles.sectionLabel}>Comments</ThemedText>
            <View style={styles.commentCard}>
              <View style={styles.commentHeader}>
                <View style={styles.commentAvatar} />
                <ThemedText style={styles.commentUserName}>User name</ThemedText>
              </View>
              <ThemedText style={styles.commentText}>
                Looks very delicious!
              </ThemedText>
            </View>
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navigationButtons}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => {
                const currentId = parseInt(id as string || '1', 10);
                const prevId = currentId - 1;
                if (prevId > 0) {
                  router.push(`/recipeDetail/${prevId}` as any);
                }
              }}
            >
              <ThemedText style={styles.navButtonText}>Last recipe</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => {
                const currentId = parseInt(id as string || '1', 10);
                const nextId = currentId + 1;
                router.push(`/recipeDetail/${nextId}` as any);
              }}
            >
              <ThemedText style={styles.navButtonText}>Next recipe</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#2C5F5F',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#E0E0E0',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 48,
  },
  contentSection: {
    backgroundColor: '#DAA520', // Yellow-orange background
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  recipeHeader: {
    marginBottom: 20,
  },
  recipeTitleRow: {
    marginBottom: 12,
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000', // Black for better contrast
    marginBottom: 8,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    marginRight: 8,
  },
  authorName: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  inputSection: {
    marginBottom: 24,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
    minHeight: 44,
    textAlignVertical: 'top',
  },
  textDisplay: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    minHeight: 44,
  },
  textDisplayContent: {
    fontSize: 16,
    color: '#000',
    lineHeight: 22,
  },
  ingredientsSection: {
    width: '100%',
    marginBottom: 24,
  },
  ingredientsContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
  },
  ingredientRow: {
    width: '100%',
    paddingVertical: 8,
  },
  ingredientSeparator: {
    width: '100%',
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 0,
  },
  ingredientText: {
    fontSize: 16,
    color: '#000',
    lineHeight: 22,
  },
  stepSection: {
    marginBottom: 24,
  },
  stepImageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#E0E0E0',
  },
  stepImage: {
    width: '100%',
    height: '100%',
  },
  stepImagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cookDetailsSection: {
    marginTop: 12,
  },
  dateRow: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  commentsSection: {
    marginBottom: 24,
  },
  commentCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    marginRight: 8,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  navButton: {
    backgroundColor: '#2C5F5F',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 8,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  errorText: {
    color: '#c62828',
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
