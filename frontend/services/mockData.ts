/**
 * Mock data for development and fallback when API is unavailable
 * This data matches the original mock data structure
 */
import { FoodStatus, Recipe, User } from './api';

export const mockUsers: User[] = [
  {
    id: 1,
    username: 'Mengmeng',
    email: 'mengmeng@example.com',
    first_name: 'Mengmeng',
    last_name: 'User',
  },
  {
    id: 2,
    username: 'Siebe',
    email: 'Siebe@example.com',
    first_name: 'Siebe',
    last_name: 'User',
  },
  {
    id: 3,
    username: 'Baker',
    email: 'baker@example.com',
    first_name: 'Baker',
    last_name: 'Sweet',
  },
];

export const mockRecipes: Recipe[] = [
  {
    id: 1,
    title: 'Pizza',
    description: 'Delicious homemade pizza with pineapple, chicken, and fresh cilantro',
    ingredients: 'Pizza dough, tomato sauce, mozzarella, pineapple, chicken, red onion, cilantro',
    prepTime: '30 min',
    instructions: '1. Prepare dough\n2. Add toppings\n3. Bake at 200°C for 15 minutes',
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    visibility: 'public',
    created_at: new Date('2025-11-14').toISOString(),
    updated_at: new Date('2025-11-14').toISOString(),
    author: mockUsers[0],
  },
  {
    id: 2,
    title: 'Toast',
    description: 'Avocado toast with hard-boiled eggs and fresh greens',
    ingredients: 'Bread, avocado, eggs, greens, salt, pepper',
    prepTime: '15 min',
    instructions: '1. Toast bread\n2. Mash avocado\n3. Add eggs and greens',
    image_url: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
    visibility: 'public',
    created_at: new Date('2025-11-13').toISOString(),
    updated_at: new Date('2025-11-13').toISOString(),
    author: mockUsers[0],
  },
  {
    id: 3,
    title: 'Burger',
    description: 'Classic burger with lettuce, tomato, cheese, and pickles',
    ingredients: 'Burger bun, beef patty, lettuce, tomato, cheese, pickles, sauce',
    prepTime: '25 min',
    instructions: '1. Cook patty\n2. Toast bun\n3. Assemble with toppings',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    visibility: 'public',
    created_at: new Date('2025-11-12').toISOString(),
    updated_at: new Date('2025-11-12').toISOString(),
    author: mockUsers[0],
  },
  {
    id: 4,
    title: 'Spieße',
    description: 'Grilled skewers with meat and vegetables',
    ingredients: 'Meat, bell peppers, mushrooms, onions, marinade',
    prepTime: '40 min',
    instructions: '1. Marinate meat\n2. Thread onto skewers\n3. Grill until cooked',
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    visibility: 'public',
    created_at: new Date('2025-11-11').toISOString(),
    updated_at: new Date('2025-11-11').toISOString(),
    author: mockUsers[0],
  },
  {
    id: 5,
    title: 'Banana-Toast',
    description: 'French toast with banana and blueberries',
    ingredients: 'Bread, eggs, milk, banana, blueberries, powdered sugar',
    prepTime: '20 min',
    instructions: '1. Make French toast\n2. Top with banana and blueberries\n3. Dust with sugar',
    image_url: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=300&fit=crop',
    visibility: 'public',
    created_at: new Date('2025-11-10').toISOString(),
    updated_at: new Date('2025-11-10').toISOString(),
    author: mockUsers[0],
  },
  {
    id: 6,
    title: 'Bowl',
    description: 'Healthy bowl with chickpeas, vegetables, and flatbread',
    ingredients: 'Chickpeas, mixed greens, olives, vegetables, flatbread, dressing',
    prepTime: '30 min',
    instructions: '1. Prepare chickpeas\n2. Arrange vegetables\n3. Serve with flatbread',
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    visibility: 'public',
    created_at: new Date('2025-11-09').toISOString(),
    updated_at: new Date('2025-11-09').toISOString(),
    author: mockUsers[0],
  },
];

export const mockStories: FoodStatus[] = [
  {
    id: 1,
    author: mockUsers[0],
    content: 'Just made the most amazing pizza! 🍕',
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    visibility: 'public',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    author: mockUsers[1],
    content: 'Perfect pasta carbonara for dinner tonight! 🍝',
    image_url: '',
    visibility: 'public',
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    author: mockUsers[0],
    content: 'Homemade sushi rolls - so fresh! 🍣',
    image_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
    visibility: 'public',
    created_at: new Date().toISOString(),
  },
];

