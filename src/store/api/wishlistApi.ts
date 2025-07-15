import { apiSlice } from './apiSlice';
import type { Product } from './productsApi';

export interface WishlistItem {
  id: string;
  productId: string;
  userId: string;
  product: Product;
  addedAt: string;
}

export const wishlistApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get user's wishlist
    getWishlist: builder.query<{ success: boolean; data: WishlistItem[] }, void>({
      query: () => '/wishlist',
      providesTags: ['Wishlist'],
    }),
    
    // Add item to wishlist
    addToWishlist: builder.mutation<{ success: boolean; data: WishlistItem }, string>({
      query: (productId) => ({
        url: '/wishlist',
        method: 'POST',
        body: { productId },
      }),
      invalidatesTags: ['Wishlist'],
    }),
    
    // Remove item from wishlist
    removeFromWishlist: builder.mutation<{ success: boolean }, string>({
      query: (productId) => ({
        url: `/wishlist/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Wishlist'],
    }),
    
    // Check if item is in wishlist
    checkWishlistItem: builder.query<{ success: boolean; data: { inWishlist: boolean } }, string>({
      query: (productId) => `/wishlist/check/${productId}`,
      providesTags: (_, __, productId) => [{ type: 'Wishlist', id: productId }],
    }),
    
    // Clear wishlist
    clearWishlist: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/wishlist',
        method: 'DELETE',
      }),
      invalidatesTags: ['Wishlist'],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useCheckWishlistItemQuery,
  useClearWishlistMutation,
} = wishlistApi;
