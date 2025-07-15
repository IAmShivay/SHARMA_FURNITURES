import { apiSlice } from './apiSlice';
import { User } from '../slices/authSlice';
import { Product } from './productsApi';
import { Order } from './ordersApi';

// Define types for admin API responses
export interface DashboardStats {
  overview: {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    totalUsers: number;
    newUsers: number;
    totalProducts: number;
    lowStockProducts: number;
  };
  topProducts: Product[];
  recentOrders: Order[];
  revenueByDay: {
    _id: {
      year: number;
      month: number;
      day: number;
    };
    revenue: number;
    orders: number;
  }[];
}

export interface UserListResponse {
  users: User[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

export interface OrderListResponse {
  orders: Order[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

export interface AnalyticsData {
  salesData: {
    _id: {
      year: number;
      month: number;
      day: number;
    };
    revenue: number;
    orders: number;
    averageOrderValue: number;
  }[];
  productPerformance: {
    name: string;
    totalSold: number;
    totalRevenue: number;
  }[];
  customerData: {
    _id: {
      year: number;
      month: number;
      day: number;
    };
    newCustomers: number;
  }[];
  period: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

// Define the admin API endpoints
export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Dashboard statistics
    getDashboardStats: builder.query<{ success: boolean; data: DashboardStats }, { startDate?: string; endDate?: string }>({
      query: ({ startDate, endDate }) => {
        let queryParams = '';
        if (startDate) queryParams += `startDate=${startDate}&`;
        if (endDate) queryParams += `endDate=${endDate}`;
        return `/admin/dashboard${queryParams ? `?${queryParams}` : ''}`;
      },
      providesTags: ['Admin', 'Order', 'User', 'Product'],
    }),

    // User management
    getUsers: builder.query<
      { success: boolean; data: UserListResponse },
      { page?: number; limit?: number; search?: string; role?: string; isActive?: boolean; sortBy?: string; sortOrder?: 'asc' | 'desc' }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.role) queryParams.append('role', params.role);
        if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
        
        return `/admin/users?${queryParams.toString()}`;
      },
      providesTags: (result) => 
        result 
          ? [
              ...result.data.users.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    // Update user role
    updateUserRole: builder.mutation<
      { success: boolean; data: { user: User } },
      { id: string; role: 'customer' | 'support' | 'manager' | 'admin' }
    >({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),

    // Update user status (activate/deactivate)
    updateUserStatus: builder.mutation<
      { success: boolean; data: { user: User } },
      { id: string; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/admin/users/${id}/status`,
        method: 'PUT',
        body: { isActive },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),

    // Order management
    getOrders: builder.query<
      { success: boolean; data: OrderListResponse },
      { 
        page?: number; 
        limit?: number; 
        status?: string;
        paymentStatus?: string;
        shippingStatus?: string;
        startDate?: string;
        endDate?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
      }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
        
        return `/admin/orders?${queryParams.toString()}`;
      },
      providesTags: (result) => 
        result 
          ? [
              ...result.data.orders.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    // Update order status
    updateOrderStatus: builder.mutation<
      { success: boolean; data: { order: { id: string; orderNumber: string; status: string; timeline: any[] } } },
      { id: string; status: string; notes?: string }
    >({
      query: ({ id, status, notes }) => ({
        url: `/admin/orders/${id}/status`,
        method: 'PUT',
        body: { status, notes },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),

    // Analytics
    getAnalytics: builder.query<
      { success: boolean; data: AnalyticsData },
      { period?: '7d' | '30d' | '90d' | '1y' }
    >({
      query: ({ period = '30d' }) => `/admin/analytics?period=${period}`,
      providesTags: ['Admin'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetDashboardStatsQuery,
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetAnalyticsQuery,
} = adminApi;
