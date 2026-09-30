import { apiSlice } from './apiSlice';

export interface InvoiceItem {
  name: string;
  description?: string;
  hsnCode?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  type: 'standard' | 'proforma' | 'credit_note';
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  sellerName: string;
  sellerAddress: string;
  sellerPhone: string;
  sellerEmail: string;
  sellerGstin?: string;
  sellerPan?: string;
  sellerLogo?: string;
  buyerName: string;
  buyerAddress: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerGstin?: string;
  items: InvoiceItem[];
  subtotal: number;
  discountTotal: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  shipping: number;
  roundOff: number;
  grandTotal: number;
  amountInWords: string;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'partial' | 'refunded';
  paidAmount: number;
  dueDate?: string;
  paidAt?: string;
  paymentLink?: string;
  notes?: string;
  termsAndConditions?: string;
  placeOfSupply?: string;
  createdAt: string;
  updatedAt: string;
}

const invoiceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.query<{ success: boolean; data: { invoices: Invoice[]; pagination: any } }, { page?: number; status?: string; search?: string }>({
      query: (params) => {
        const sp = new URLSearchParams();
        if (params.page) sp.set('page', String(params.page));
        if (params.status) sp.set('status', params.status);
        if (params.search) sp.set('search', params.search);
        return `/invoices?${sp.toString()}`;
      },
      providesTags: ['Invoice' as any],
    }),
    getInvoice: builder.query<{ success: boolean; data: Invoice }, string>({
      query: (id) => `/invoices/${id}`,
      providesTags: ['Invoice' as any],
    }),
    createInvoice: builder.mutation<{ success: boolean; data: Invoice }, Partial<Invoice>>({
      query: (body) => ({ url: '/invoices', method: 'POST', body }),
      invalidatesTags: ['Invoice' as any],
    }),
    updateInvoice: builder.mutation<{ success: boolean; data: Invoice }, { id: string; data: Partial<Invoice> }>({
      query: ({ id, data }) => ({ url: `/invoices/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Invoice' as any],
    }),
    deleteInvoice: builder.mutation<void, string>({
      query: (id) => ({ url: `/invoices/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Invoice' as any],
    }),
    createPayment: builder.mutation<{ success: boolean; data: any }, string>({
      query: (id) => ({ url: `/invoices/${id}/create-payment`, method: 'POST' }),
      invalidatesTags: ['Invoice' as any],
    }),
    markPaid: builder.mutation<{ success: boolean; data: Invoice }, { id: string; transactionId?: string; paymentMethod?: string }>({
      query: ({ id, ...body }) => ({ url: `/invoices/${id}/mark-paid`, method: 'POST', body }),
      invalidatesTags: ['Invoice' as any],
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useGetInvoiceQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useCreatePaymentMutation,
  useMarkPaidMutation,
} = invoiceApi;
