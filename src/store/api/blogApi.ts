import { apiSlice } from './apiSlice';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: { id: string; name: string; avatar?: string } | string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  publishedAt?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFilters {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  status?: string;
}

export const blogApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Public: list published posts
    getBlogPosts: builder.query<
      { success: boolean; data: { items: BlogPost[]; pagination: { current: number; pages: number; total: number; limit: number } } },
      BlogFilters
    >({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) params.append(key, value.toString());
        });
        return `/blog?${params.toString()}`;
      },
      providesTags: (result) =>
        result?.data?.items
          ? [...result.data.items.map((p) => ({ type: 'BlogPost' as const, id: p.id })), { type: 'BlogPost', id: 'LIST' }]
          : [{ type: 'BlogPost', id: 'LIST' }],
    }),

    // Public: get single post by slug
    getBlogPost: builder.query<{ success: boolean; data: { post: BlogPost } }, string>({
      query: (slug) => `/blog/slug/${slug}`,
      providesTags: (_, __, slug) => [{ type: 'BlogPost', id: slug }],
    }),

    // Public: get categories
    getBlogCategories: builder.query<{ success: boolean; data: { name: string; count: number }[] }, void>({
      query: () => '/blog/categories',
    }),

    // Admin: list all posts
    getAdminBlogPosts: builder.query<
      { success: boolean; data: { items: BlogPost[]; pagination: { current: number; pages: number; total: number; limit: number } } },
      BlogFilters
    >({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) params.append(key, value.toString());
        });
        return `/blog/admin?${params.toString()}`;
      },
      providesTags: [{ type: 'BlogPost', id: 'LIST' }],
    }),

    // Admin: create post
    createBlogPost: builder.mutation<{ success: boolean; data: { post: BlogPost } }, Partial<BlogPost>>({
      query: (body) => ({ url: '/blog', method: 'POST', body }),
      invalidatesTags: [{ type: 'BlogPost', id: 'LIST' }],
    }),

    // Admin: update post
    updateBlogPost: builder.mutation<{ success: boolean; data: { post: BlogPost } }, { id: string; updates: Partial<BlogPost> }>({
      query: ({ id, updates }) => ({ url: `/blog/${id}`, method: 'PUT', body: updates }),
      invalidatesTags: (_, __, { id }) => [{ type: 'BlogPost', id }, { type: 'BlogPost', id: 'LIST' }],
    }),

    // Admin: delete post
    deleteBlogPost: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/blog/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'BlogPost', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetBlogPostsQuery,
  useGetBlogPostQuery,
  useGetBlogCategoriesQuery,
  useGetAdminBlogPostsQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
} = blogApi;
