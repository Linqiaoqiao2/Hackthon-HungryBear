import React, { useState } from 'react';
import { StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { apiService } from '@/services/api';

export default function PublishRecipeScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title || !ingredients || !instructions) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await apiService.createRecipe({
        title,
        description,
        prepTime,
        ingredients,
        instructions,
        visibility: 'friends',
      });
      Alert.alert('Success', 'Recipe created!', [
        { 
          text: 'OK', 
          onPress: () => {
            // Clear form after successful creation
            setTitle('');
            setDescription('');
            setPrepTime('');
            setIngredients('');
            setInstructions('');
          }
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create recipe');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Add a new recipe</ThemedText>
        <TouchableOpacity onPress={handleCreate} disabled={loading}>
          <ThemedText style={styles.saveButton}>{loading ? 'Adding Recipe...' : 'Add Recipe'}</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <ScrollView style={styles.scrollView}>
        <ThemedText style={styles.label}>Name of recipe *</ThemedText>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter name"
        />
        <ThemedText style={styles.label}>Tags/category</ThemedText>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Choose tags"
          multiline
        />
        {/* I had to add a field, so I just copied the code for "Tags/category" and hope it'll work */}
        <ThemedText style={styles.label}>Preparation time</ThemedText>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={prepTime}
          onChangeText={setPrepTime}
          placeholder="Enter time"
          multiline
        />
        <ThemedText style={styles.label}>Ingredients *</ThemedText>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={ingredients}
          onChangeText={setIngredients}
          placeholder="Choose tags"
          multiline
        />
        {/* there is no placeholder on Figma - how can I make it look like in Figma? */}
        <ThemedText style={styles.label}>Preparation *</ThemedText>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={instructions}
          onChangeText={setInstructions}
          placeholder="Step-by-step instructions"
          multiline
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#81B29A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#81B29A',
  },
  saveButton: {
    color: '#007AFF',
    fontWeight: '600',
    backgroundColor: '#fff',
  },
  /* background of body */
  scrollView: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  /* Titles of Textboxes */
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,  
  },
  /* Textbox Name of Recipe */
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 44,
  },
  /* other textboxes */
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
});

