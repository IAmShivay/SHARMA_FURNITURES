import { apiSlice } from './apiSlice';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  selectedColor?: string;
  selectedFinish?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get user orders
    getUserOrders: builder.query<{ success: boolean; data: Order[] }, void>({
      query: () => '/orders',
      providesTags: ['Order'],
    }),
    
    // Get single order
    getOrder: builder.query<{ success: boolean; data: Order }, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_, __, id) => [{ type: 'Order', id }],
    }),
    
    // Create order
    createOrder: builder.mutation<
      { success: boolean; data: Order },
      { items: OrderItem[]; shippingAddress: Address; paymentMethod: string; deliveryOption?: string }
    >({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order', 'Cart'],
    }),
    
    // Update order status
    updateOrderStatus: builder.mutation<
      { success: boolean; data: Order },
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Order', id }],
    }),
  }),
});

export const {
  useGetUserOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
} = ordersApi;
