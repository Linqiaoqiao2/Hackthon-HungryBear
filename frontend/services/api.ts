import axios, { AxiosError, AxiosInstance } from 'axios';
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
  prepTime?: string;
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
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string = API_BASE_URL) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 seconds timeout
    });

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timeout. Please check your connection.');
        }
        if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
          throw new Error(
            `Cannot connect to backend server at ${baseUrl}. ` +
            `Make sure the Django server is running (python manage.py runserver).`
          );
        }
        if (error.response) {
          const errorMessage = error.response.data
            ? typeof error.response.data === 'string'
              ? error.response.data
              : JSON.stringify(error.response.data)
            : error.response.statusText;
          throw new Error(`API Error (${error.response.status}): ${errorMessage}`);
        }
        throw error;
      }
    );
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.request<T>({
        method,
        url: endpoint,
        data,
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Recipe endpoints
  async getRecipes(): Promise<Recipe[]> {
    const response = await this.request<{ results: Recipe[] } | Recipe[]>('GET', 'recipes/');
    return Array.isArray(response) ? response : (response.results || []);
  }

  async getRecipe(id: number): Promise<Recipe> {
    return this.request<Recipe>('GET', `recipes/${id}/`);
  }

  async createRecipe(recipe: Partial<Recipe>): Promise<Recipe> {
    return this.request<Recipe>('POST', 'recipes/', recipe);
  }

  async updateRecipe(id: number, recipe: Partial<Recipe>): Promise<Recipe> {
    return this.request<Recipe>('PATCH', `recipes/${id}/`, recipe);
  }

  async deleteRecipe(id: number): Promise<void> {
    await this.request<void>('DELETE', `recipes/${id}/`);
  }

  // Food Status endpoints
  async getFoodStatuses(): Promise<FoodStatus[]> {
    const response = await this.request<{ results: FoodStatus[] } | FoodStatus[]>('GET', 'food-statuses/');
    return Array.isArray(response) ? response : (response.results || []);
  }

  async createFoodStatus(status: Partial<FoodStatus>): Promise<FoodStatus> {
    return this.request<FoodStatus>('POST', 'food-statuses/', status);
  }

  // Friendship endpoints
  async getFriendships(): Promise<Friendship[]> {
    const response = await this.request<{ results: Friendship[] } | Friendship[]>('GET', 'friendships/');
    return Array.isArray(response) ? response : (response.results || []);
  }

  async createFriendship(addresseeId: number): Promise<Friendship> {
    return this.request<Friendship>('POST', 'friendships/', { addressee: addresseeId });
  }

  // User endpoints
  async getUsers(): Promise<User[]> {
    const response = await this.request<{ results: User[] } | User[]>('GET', 'users/');
    return Array.isArray(response) ? response : (response.results || []);
  }

  async getUser(id: number): Promise<User> {
    return this.request<User>('GET', `users/${id}/`);
  }
}

export const apiService = new ApiService();

