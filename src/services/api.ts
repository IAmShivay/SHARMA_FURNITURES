// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Types
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  category: string;
  subcategory: string;
  material: string;
  colors: string[];
  finishes: string[];
  dimensions: {
    length: string;
    width: string;
    height: string;
    weight: string;
  };
  features: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  selectedColor?: string;
  selectedFinish?: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addresses: Address[];
}

// HTTP Client
class ApiClient {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  setAuthToken(token: string) {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken() {
    delete this.headers['Authorization'];
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: this.headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

// Product API
export const productApi = {
  // Get all products with filters
  getProducts: async (filters?: {
    category?: string;
    priceMin?: number;
    priceMax?: number;
    material?: string;
    color?: string;
    inStock?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ products: Product[]; total: number; page: number; totalPages: number }>> => {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get(endpoint);
  },

  // Get single product
  getProduct: async (id: string): Promise<ApiResponse<Product>> => {
    return apiClient.get(`/products/${id}`);
  },

  // Get featured products
  getFeaturedProducts: async (): Promise<ApiResponse<Product[]>> => {
    return apiClient.get('/products/featured');
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<ApiResponse<Product[]>> => {
    return apiClient.get(`/products/category/${category}`);
  },

  // Search products
  searchProducts: async (query: string): Promise<ApiResponse<Product[]>> => {
    return apiClient.get(`/products/search?q=${encodeURIComponent(query)}`);
  },
};

// Order API
export const orderApi = {
  // Create order
  createOrder: async (orderData: {
    items: OrderItem[];
    shippingAddress: Address;
    paymentMethod: string;
  }): Promise<ApiResponse<Order>> => {
    return apiClient.post('/orders', orderData);
  },

  // Get user orders
  getUserOrders: async (): Promise<ApiResponse<Order[]>> => {
    return apiClient.get('/orders');
  },

  // Get single order
  getOrder: async (id: string): Promise<ApiResponse<Order>> => {
    return apiClient.get(`/orders/${id}`);
  },

  // Update order status
  updateOrderStatus: async (id: string, status: string): Promise<ApiResponse<Order>> => {
    return apiClient.put(`/orders/${id}/status`, { status });
  },
};

// User API
export const userApi = {
  // Register user
  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> => {
    return apiClient.post('/auth/register', userData);
  },

  // Login user
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> => {
    return apiClient.post('/auth/login', credentials);
  },

  // Get user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiClient.get('/auth/profile');
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    return apiClient.put('/auth/profile', userData);
  },

  // Add address
  addAddress: async (address: Address): Promise<ApiResponse<User>> => {
    return apiClient.post('/auth/addresses', address);
  },

  // Update address
  updateAddress: async (addressId: string, address: Address): Promise<ApiResponse<User>> => {
    return apiClient.put(`/auth/addresses/${addressId}`, address);
  },

  // Delete address
  deleteAddress: async (addressId: string): Promise<ApiResponse<User>> => {
    return apiClient.delete(`/auth/addresses/${addressId}`);
  },
};

// Delivery API
export const deliveryApi = {
  // Check delivery availability
  checkDelivery: async (zipCode: string): Promise<ApiResponse<{
    available: boolean;
    estimatedDays: number;
    expressAvailable: boolean;
    cost: number;
  }>> => {
    return apiClient.get(`/delivery/check/${zipCode}`);
  },

  // Track order
  trackOrder: async (orderId: string): Promise<ApiResponse<{
    status: string;
    location: string;
    estimatedDelivery: string;
    updates: Array<{
      status: string;
      timestamp: string;
      location?: string;
      description: string;
    }>;
  }>> => {
    return apiClient.get(`/delivery/track/${orderId}`);
  },
};

// Newsletter API
export const newsletterApi = {
  // Subscribe to newsletter
  subscribe: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post('/newsletter/subscribe', { email });
  },

  // Unsubscribe from newsletter
  unsubscribe: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post('/newsletter/unsubscribe', { email });
  },
};

// Contact API
export const contactApi = {
  // Send contact form
  sendMessage: async (messageData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    inquiryType: string;
  }): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post('/contact', messageData);
  },
};

// Export API client for custom requests
export { apiClient };

// Export types
export type { Product, Order, OrderItem, Address, User, ApiResponse };
