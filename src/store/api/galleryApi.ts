import { apiSlice } from './apiSlice';

export interface GalleryItem {
  _id: string;
  id: string;
  title: string;
  description: string;
  images: string[];
  type: 'inspiration' | 'project';
  category: string;
  clientName?: string;
  location?: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface GalleryListResponse {
  success: boolean;
  data: {
    items: GalleryItem[];
    total: number;
    page: number;
    pages: number;
  };
}

interface GalleryItemResponse {
  success: boolean;
  data: GalleryItem;
}

const galleryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGalleryItems: builder.query<GalleryListResponse, { page?: number; limit?: number; type?: string; category?: string; featured?: boolean }>({
      query: (params) => {
        const sp = new URLSearchParams();
        if (params.page) sp.set('page', String(params.page));
        if (params.limit) sp.set('limit', String(params.limit));
        if (params.type) sp.set('type', params.type);
        if (params.category) sp.set('category', params.category);
        if (params.featured) sp.set('featured', 'true');
        return `/gallery?${sp.toString()}`;
      },
      providesTags: ['Gallery'],
    }),
    getGalleryItem: builder.query<GalleryItemResponse, string>({
      query: (id) => `/gallery/${id}`,
      providesTags: ['Gallery'],
    }),
    createGalleryItem: builder.mutation<GalleryItemResponse, Partial<GalleryItem>>({
      query: (body) => ({ url: '/gallery', method: 'POST', body }),
      invalidatesTags: ['Gallery'],
    }),
    updateGalleryItem: builder.mutation<GalleryItemResponse, { id: string; data: Partial<GalleryItem> }>({
      query: ({ id, data }) => ({ url: `/gallery/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Gallery'],
    }),
    deleteGalleryItem: builder.mutation<void, string>({
      query: (id) => ({ url: `/gallery/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Gallery'],
    }),
  }),
});

export const {
  useGetGalleryItemsQuery,
  useGetGalleryItemQuery,
  useCreateGalleryItemMutation,
  useUpdateGalleryItemMutation,
  useDeleteGalleryItemMutation,
} = galleryApi;
