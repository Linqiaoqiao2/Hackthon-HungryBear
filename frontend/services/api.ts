import { getApiBaseUrl } from './config';

const API_BASE_URL = getApiBaseUrl();

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Recipe {
  id: number;
  author: User;
  title: string;
  description: string;
  ingredients: string;
  prepTime: string;
  instructions: string;
  image_url?: string;
  visibility: 'private' | 'friends' | 'friends_network' | 'public';
  created_at: string;
  updated_at: string;
}

export interface FoodStatus {
  id: number;
  author: User;
  content: string;
  image_url?: string;
  visibility: 'private' | 'friends' | 'friends_network' | 'public';
  created_at: string;
  expires_at?: string;
}

export interface Friendship {
  id: number;
  requester: User;
  addressee: User;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  updated_at: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error (${response.status}): ${errorText || response.statusText}`);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }
      return {} as T;
    } catch (error: any) {
      if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
        throw new Error(
          `Cannot connect to backend server at ${this.baseUrl}. ` +
          `Make sure the Django server is running (python manage.py runserver). ` +
          `If using a physical device, update the API_BASE_URL with your computer's IP address.`
        );
      }
      throw error;
    }
  }

  // Recipe endpoints
  async getRecipes(): Promise<Recipe[]> {
    const response = await this.request<{ results: Recipe[] } | Recipe[]>('/recipes/');
    return Array.isArray(response) ? response : (response.results || []);
  }

  async getRecipe(id: number): Promise<Recipe> {
    return this.request<Recipe>(`/recipes/${id}/`);
  }

  async createRecipe(recipe: Partial<Recipe>): Promise<Recipe> {
    return this.request<Recipe>('/recipes/', {
      method: 'POST',
      body: JSON.stringify(recipe),
    });
  }

  async updateRecipe(id: number, recipe: Partial<Recipe>): Promise<Recipe> {
    return this.request<Recipe>(`/recipes/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(recipe),
    });
  }

  async deleteRecipe(id: number): Promise<void> {
    await this.request(`/recipes/${id}/`, {
      method: 'DELETE',
    });
  }

  // Food Status endpoints
  async getFoodStatuses(): Promise<FoodStatus[]> {
    const response = await this.request<{ results: FoodStatus[] } | FoodStatus[]>('/food-statuses/');
    return Array.isArray(response) ? response : (response.results || []);
  }

  async createFoodStatus(status: Partial<FoodStatus>): Promise<FoodStatus> {
    return this.request<FoodStatus>('/food-statuses/', {
      method: 'POST',
      body: JSON.stringify(status),
    });
  }

  // Friendship endpoints
  async getFriendships(): Promise<Friendship[]> {
    const response = await this.request<{ results: Friendship[] } | Friendship[]>('/friendships/');
    return Array.isArray(response) ? response : (response.results || []);
  }

  async createFriendship(addresseeId: number): Promise<Friendship> {
    return this.request<Friendship>('/friendships/', {
      method: 'POST',
      body: JSON.stringify({ addressee: addresseeId }),
    });
  }

  // User endpoints
  async getUsers(): Promise<User[]> {
    const response = await this.request<{ results: User[] } | User[]>('/users/');
    return Array.isArray(response) ? response : (response.results || []);
  }

  async getUser(id: number): Promise<User> {
    return this.request<User>(`/users/${id}/`);
  }
}

export const apiService = new ApiService();

