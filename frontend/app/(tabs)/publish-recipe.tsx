import React, { useState } from 'react';
import { StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, View} from 'react-native';
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
          placeholder="Choose Ingredients"
          multiline
        />
        <View style={styles.ingredientButton}>
          <TouchableOpacity onPress={handleCreate} style={styles.button}>
            <ThemedText style={styles.ingredientButton}>{'Add ingredient'}</ThemedText>
          </TouchableOpacity>
        </View>
        {/* there is no placeholder on Figma - how can I make it look like in Figma? */}
        <ThemedText style={styles.label}>Preparation *</ThemedText>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={instructions}
          onChangeText={setInstructions}
          placeholder="Step-by-step instructions"
          multiline
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={handleCreate} disabled={loading} style={styles.button}>
            <ThemedText style={styles.saveButton}>{loading ? 'Posting...' : 'Post'}</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCreate} style={styles.button}>
            <ThemedText style={styles.deleteButton}>Delete</ThemedText>
          </TouchableOpacity>
        </View>

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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#81B29A',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 6,
    textAlign: 'center',
  },
  ingredientButton: {
    flexDirection: 'row',
    color: '#fff',
    fontWeight: '600',
    paddingHorizontal: 4,
    paddingVertical: 2,
    backgroundColor: '#A20021',
    textAlign: 'center',
    borderRadius: 6, //rounded corners
  },
  saveButton: {
    flexDirection: 'row',
    color: '#fff',
    fontWeight: '600',
    paddingHorizontal: 4,
    paddingVertical: 2,
    backgroundColor: '#A20021',
    textAlign: 'center',
    borderRadius: 6, //rounded corners
  },
  deleteButton: {
    flexDirection: 'row',
    color: '#fff',
    fontWeight: '600',
    paddingHorizontal: 4,
    paddingVertical: 2,
    padding: 2,
    backgroundColor: '#A20021',
    textAlign: 'center',
    borderRadius: 6, //rounded corners
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

