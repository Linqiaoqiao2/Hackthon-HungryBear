import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  View, 
  Image, 
  TextInput, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { apiService, Recipe } from '@/services/api';

const { width } = Dimensions.get('window');

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState('');
  const [cookDetails, setCookDetails] = useState('');

  useEffect(() => {
    if (id) {
      loadRecipe(parseInt(id));
    }
  }, [id]);

  const loadRecipe = async (recipeId: number) => {
    try {
      // For now, use mock data. Uncomment to load from API:
      // const data = await apiService.getRecipe(recipeId);
      // setRecipe(data);
      
      // Mock data for testing
      const mockRecipe: Recipe = {
        id: recipeId,
        title: 'Pizza',
        description: 'Delicious homemade pizza',
        ingredients: 'Salt: 1 spoon\nFlour: 2 cups\nTomato sauce: 1 cup\nCheese: 200g',
        prepTime: '30 min',
        instructions: '1. Mix flour and salt\n2. Add water and knead\n3. Add toppings\n4. Bake at 200°C',
        image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
        visibility: 'public',
        created_at: '2025-11-14T10:00:00Z',
        updated_at: '2025-11-14T10:00:00Z',
        author: {
          id: 1,
          username: 'Mengmeng',
          email: 'mengmeng@example.com',
          first_name: 'Mengmeng',
          last_name: 'User',
        },
      };
      setRecipe(mockRecipe);
      setStory('This is a delicious recipe that has been passed down through generations...');
      setCookDetails('Cook for 15 minutes at 200°C until golden brown.');
    } catch (error) {
      console.error('Error loading recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading...</ThemedText>
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

  // Parse ingredients into array
  const ingredientsList = recipe.ingredients.split('\n').filter(item => item.trim());

  // Parse instructions into steps
  const stepsList = recipe.instructions.split('\n').filter(step => step.trim());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\./g, '.');
  };

  return (
    <View style={styles.outerContainer}>
      {/* Header Section - Dark Teal */}
      <View style={styles.headerSection}>
        <ThemedText style={styles.headerTitle}>Recipe detail</ThemedText>
      </View>

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
          {/* Name of recipe with author and Cooking mode button */}
          <View style={styles.recipeHeader}>
            <View style={styles.recipeTitleRow}>
              <ThemedText style={styles.sectionLabel}>Name of recipe</ThemedText>
              <ThemedText style={styles.recipeTitle}>{recipe.title}</ThemedText>
              <View style={styles.authorRow}>
                <View style={styles.authorAvatar} />
                <ThemedText style={styles.authorName}>{recipe.author.username}</ThemedText>
              </View>
            </View>
            <TouchableOpacity style={styles.cookingModeButton}>
              <ThemedText style={styles.cookingModeText}>Cooking mode</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Story behind this Dish */}
          <View style={styles.inputSection}>
            <ThemedText style={styles.sectionLabel}>Story behind this Dish</ThemedText>
            <TextInput
              style={styles.textInput}
              placeholder="Story behind this Dish"
              placeholderTextColor="#999"
              multiline
              value={story}
              onChangeText={setStory}
            />
          </View>

          {/* Ingredients */}
          <View style={styles.ingredientsSection}>
            <ThemedText style={styles.sectionLabel}>Ingredients</ThemedText>
            {ingredientsList.map((ingredient, index) => {
              const parts = ingredient.split(':');
              const name = parts[0]?.trim() || ingredient;
              const amount = parts[1]?.trim() || '';
              return (
                <View key={index} style={styles.ingredientRow}>
                  <TextInput
                    style={styles.ingredientInput}
                    value={`${name}${amount ? `: ${amount}` : ''}`}
                    placeholderTextColor="#999"
                  />
                </View>
              );
            })}
          </View>

          {/* Steps */}
          {stepsList.map((step, index) => (
            <View key={index} style={styles.stepSection}>
              <ThemedText style={styles.sectionLabel}>{index + 1}. step</ThemedText>
              <View style={styles.stepImagePlaceholder}>
                <ThemedText style={styles.placeholderIcon}>🏔️☀️</ThemedText>
              </View>
              {index === 0 && (
                <View style={styles.cookDetailsSection}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Cook details"
                    placeholderTextColor="#999"
                    multiline
                    value={cookDetails}
                    onChangeText={setCookDetails}
                  />
                </View>
              )}
            </View>
          ))}

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
                wrote comment wrote comment wrote comment wrote comment wrote comment wrote comment
              </ThemedText>
            </View>
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navigationButtons}>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => {
                const prevId = parseInt(id || '1') - 1;
                if (prevId > 0) {
                  router.replace(`/recipe/${prevId}`);
                }
              }}
            >
              <ThemedText style={styles.navButtonText}>Last recipe</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => {
                const nextId = parseInt(id || '1') + 1;
                router.replace(`/recipe/${nextId}`);
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
  headerSection: {
    backgroundColor: '#2C5F5F',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
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
    color: '#B8860B', // Dark orange
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
  cookingModeButton: {
    backgroundColor: '#2C5F5F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  cookingModeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  ingredientsSection: {
    marginBottom: 24,
  },
  ingredientRow: {
    marginBottom: 8,
  },
  ingredientInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  stepSection: {
    marginBottom: 24,
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
});
