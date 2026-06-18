import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

// Define the base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  prepareHeaders: (headers, { getState }) => {
    // Get token from auth state
    const token = (getState() as RootState).auth.token;
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    headers.set('content-type', 'application/json');
    return headers;
  },
});

// Enhanced base query with re-authentication
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // If we get a 401, try to refresh the token
  if (result.error && result.error.status === 401) {
    // Try to get a new token
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
      },
      api,
      extraOptions
    );
    
    if (refreshResult.data) {
      // Store the new token
      api.dispatch({ type: 'auth/setCredentials', payload: refreshResult.data });
      
      // Retry the original query
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, logout user
      api.dispatch({ type: 'auth/logout' });
    }
  }
  
  return result;
};

// Create the API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Product', 
    'Order', 
    'Cart', 
    'Wishlist',
    'Review',
    'Category',
    'Admin',
    'BlogPost'
  ],
  endpoints: (builder) => ({
    // Health check endpoint
    healthCheck: builder.query<{ status: string }, void>({
      query: () => '/health',
    }),
  }),
});

export const { useHealthCheckQuery } = apiSlice;
