import { env } from '@/lib/env';
import { useUIStore } from '@/store';

/**
 * API Response types
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public data: any,
    message?: string
  ) {
    super(message || 'API Error');
    this.name = 'ApiError';

    // Add user-friendly error messages based on status code
    if (!message) {
      switch (status) {
        case 400:
          this.message = 'Invalid request data';
          break;
        case 401:
          this.message = 'Authentication required';
          break;
        case 403:
          this.message = 'You do not have permission to perform this action';
          break;
        case 404:
          this.message = 'Resource not found';
          break;
        case 408:
          this.message = 'Request timeout';
          break;
        case 409:
          this.message = 'Conflict with existing data';
          break;
        case 422:
          this.message = 'Validation error';
          break;
        case 429:
          this.message = 'Too many requests, please try again later';
          break;
        case 500:
          this.message = 'Server error, please try again later';
          break;
        default:
          this.message = 'An error occurred';
      }
    }
  }

  /**
   * Get a user-friendly error message from the error data
   */
  getUserFriendlyMessage(): string {
    // Try to extract a message from the error data
    if (this.data) {
      if (typeof this.data.message === 'string') {
        return this.data.message;
      }

      if (Array.isArray(this.data.errors) && this.data.errors.length > 0) {
        return this.data.errors.map((e: any) => e.message || e).join(', ');
      }
    }

    return this.message;
  }
}

/**
 * Network status monitoring
 */
export class NetworkMonitor {
  private static instance: NetworkMonitor;
  private isOnline: boolean = true;
  private listeners: Set<(online: boolean) => void> = new Set();

  private constructor() {
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine;

      window.addEventListener('online', () => this.updateStatus(true));
      window.addEventListener('offline', () => this.updateStatus(false));
    }
  }

  public static getInstance(): NetworkMonitor {
    if (!NetworkMonitor.instance) {
      NetworkMonitor.instance = new NetworkMonitor();
    }
    return NetworkMonitor.instance;
  }

  private updateStatus(online: boolean): void {
    this.isOnline = online;
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.isOnline));
  }

  public getStatus(): boolean {
    return this.isOnline;
  }

  public addListener(listener: (online: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

/**
 * API Client for making requests to the backend
 */
export class ApiClient {
  private baseURL: string;
  private token: string | null;
  private networkMonitor: NetworkMonitor;

  constructor(baseURL: string = env.apiUrl) {
    this.baseURL = baseURL;
    this.token = null;
    this.networkMonitor = NetworkMonitor.getInstance();
  }

  /**
   * Set the authentication token for requests
   */
  setToken(token: string | null): void {
    this.token = token;
  }

  /**
   * Get the current token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Check if the client is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * Make a request to the API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Check network status
    if (!this.networkMonitor.getStatus()) {
      // Show offline toast
      if (typeof window !== 'undefined') {
        const uiStore = useUIStore.getState();
        uiStore.addToast({
          type: 'error',
          message: 'You are offline. Please check your internet connection.',
        });
      }
      throw new ApiError(0, { message: 'No internet connection' }, 'You are offline');
    }

    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), env.apiTimeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
        credentials: 'include', // Include cookies for CSRF protection if needed
      });

      clearTimeout(timeoutId);

      // Handle 401 Unauthorized by clearing auth state
      if (response.status === 401 && this.token) {
        // Token is invalid or expired
        this.setToken(null);

        // Show toast notification
        if (typeof window !== 'undefined') {
          const uiStore = useUIStore.getState();
          uiStore.addToast({
            type: 'error',
            message: 'Your session has expired. Please log in again.',
          });
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(response.status, errorData);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }

      return {} as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError(408, { message: 'Request timeout' }, 'Request timeout');
      }

      throw new ApiError(500, { message: 'Network error' }, 'Network error');
    }
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryString = params ? `?${new URLSearchParams(params as any)}` : '';
    return this.request<T>(`${endpoint}${queryString}`);
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Make a PATCH request
   */
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create a singleton instance of the API client
export const apiClient = new ApiClient();