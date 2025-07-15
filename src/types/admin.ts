import { Order as BaseOrder } from '../store/api/ordersApi';
import { User } from '../store/slices/authSlice';

/**
 * Extended Order type for admin use with additional properties
 */
export interface AdminOrder extends BaseOrder {
  orderNumber: string;
  user?: User;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  timeline?: Array<{
    status: string;
    timestamp: string;
    notes?: string;
  }>;
}

/**
 * Admin dashboard statistics
 */
export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  newUsers: number;
  pendingOrders: number;
  completedOrders: number;
  averageOrderValue: number;
}

/**
 * Admin filter options
 */
export interface AdminFilters {
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  role?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Admin pagination state
 */
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
