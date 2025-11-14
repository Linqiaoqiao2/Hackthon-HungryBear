import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { apiService, Recipe } from '@/services/api';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadRecipe(parseInt(id));
    }
  }, [id]);

  const loadRecipe = async (recipeId: number) => {
    try {
      const data = await apiService.getRecipe(recipeId);
      setRecipe(data);
    } catch (error) {
      console.error('Error loading recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (!recipe) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Recipe not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedText type="title" style={styles.title}>{recipe.title}</ThemedText>
        <ThemedText style={styles.author}>By {recipe.author.username}</ThemedText>
        {recipe.description && (
          <ThemedText style={styles.description}>{recipe.description}</ThemedText>
        )}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Ingredients</ThemedText>
          <ThemedText style={styles.content}>{recipe.ingredients}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Instructions</ThemedText>
          <ThemedText style={styles.content}>{recipe.instructions}</ThemedText>
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
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
  author: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 16,
  },
  description: {
    marginBottom: 24,
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  content: {
    marginTop: 8,
    lineHeight: 24,
  },
});

