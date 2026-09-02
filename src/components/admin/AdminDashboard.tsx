import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  Eye,
  AlertTriangle,
  Calendar,
  Filter
} from 'lucide-react';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
  averageOrderValue: number;
  completedOrders: number;
  cancelledOrders: number;
  newUsers: number;
  lowStockProducts: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  user: {
    name: string;
    email: string;
  };
  total: number;
  status: string;
  createdAt: string;
}

interface TopProduct {
  id: string;
  name: string;
  salesCount: number;
  basePrice: number;
  images: string[];
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    averageOrderValue: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    newUsers: 0,
    lowStockProducts: 0
  });
  
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setStats({
          totalOrders: 1247,
          totalRevenue: 284750,
          totalUsers: 3456,
          totalProducts: 234,
          averageOrderValue: 228.45,
          completedOrders: 1156,
          cancelledOrders: 91,
          newUsers: 89,
          lowStockProducts: 12
        });

        setRecentOrders([
          {
            id: '1',
            orderNumber: 'ORD-2024-001',
            user: { name: 'John Doe', email: 'john@example.com' },
            total: 1299,
            status: 'completed',
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            orderNumber: 'ORD-2024-002',
            user: { name: 'Jane Smith', email: 'jane@example.com' },
            total: 899,
            status: 'processing',
            createdAt: '2024-01-15T09:15:00Z'
          },
          {
            id: '3',
            orderNumber: 'ORD-2024-003',
            user: { name: 'Mike Johnson', email: 'mike@example.com' },
            total: 2499,
            status: 'shipped',
            createdAt: '2024-01-14T16:45:00Z'
          }
        ]);

        setTopProducts([
          {
            id: '1',
            name: 'Premium Scandinavian Sofa',
            salesCount: 45,
            basePrice: 2499,
            images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg']
          },
          {
            id: '2',
            name: 'Luxury Accent Chair',
            salesCount: 32,
            basePrice: 899,
            images: ['https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg']
          },
          {
            id: '3',
            name: 'Glass Coffee Table',
            salesCount: 28,
            basePrice: 799,
            images: ['https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg']
          }
        ]);

        setLoading(false);
      }, 1000);
    };

    fetchDashboardData();
  }, [dateRange]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    change?: string;
    changeType?: 'positive' | 'negative';
    color: string;
  }> = ({ title, value, icon, change, changeType, color }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-4 rounded-2xl ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store.</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              
              <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200 flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Custom Range</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
            icon={<DollarSign className="w-6 h-6 text-white" />}
            change="+12.5%"
            changeType="positive"
            color="bg-green-500"
          />
          
          <StatCard
            title="Total Orders"
            value={stats.totalOrders.toLocaleString()}
            icon={<ShoppingCart className="w-6 h-6 text-white" />}
            change="+8.2%"
            changeType="positive"
            color="bg-blue-500"
          />
          
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={<Users className="w-6 h-6 text-white" />}
            change="+15.3%"
            changeType="positive"
            color="bg-purple-500"
          />
          
          <StatCard
            title="Products"
            value={stats.totalProducts.toLocaleString()}
            icon={<Package className="w-6 h-6 text-white" />}
            color="bg-amber-500"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Average Order Value"
            value={`₹${stats.averageOrderValue.toFixed(2)}`}
            icon={<BarChart3 className="w-6 h-6 text-white" />}
            change="+5.7%"
            changeType="positive"
            color="bg-indigo-500"
          />
          
          <StatCard
            title="New Users"
            value={stats.newUsers.toLocaleString()}
            icon={<Users className="w-6 h-6 text-white" />}
            change="+23.1%"
            changeType="positive"
            color="bg-teal-500"
          />
          
          <StatCard
            title="Low Stock Items"
            value={stats.lowStockProducts.toLocaleString()}
            icon={<AlertTriangle className="w-6 h-6 text-white" />}
            color="bg-red-500"
          />
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
              <button className="text-amber-600 hover:text-amber-700 font-medium">View All</button>
            </div>
            
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">{order.user.name}</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{order.total.toLocaleString('en-IN')}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Top Products</h3>
              <button className="text-amber-600 hover:text-amber-700 font-medium">View All</button>
            </div>
            
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex-shrink-0">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-600">₹{product.basePrice.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{product.salesCount} sold</p>
                    <p className="text-sm text-gray-600">#{index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="flex items-center space-x-3 p-4 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors duration-200">
              <Package className="w-6 h-6 text-amber-600" />
              <span className="font-medium text-gray-900">Add Product</span>
            </button>
            
            <button className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200">
              <Users className="w-6 h-6 text-blue-600" />
              <span className="font-medium text-gray-900">Manage Users</span>
            </button>
            
            <button className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200">
              <ShoppingCart className="w-6 h-6 text-green-600" />
              <span className="font-medium text-gray-900">View Orders</span>
            </button>
            
            <button className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors duration-200">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              <span className="font-medium text-gray-900">Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
