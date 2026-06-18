import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SEOHead from '../../common/SEOHead';
import { selectHasPermission } from '../../../store/slices/authSlice';
import { useGetDashboardStatsQuery } from '../../../store/api/adminApi';
import { Loader, AlertCircle, Users, Package, DollarSign, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters.ts';

// Dashboard card component
const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  loading: boolean;
}> = ({ title, value, icon, color, loading }) => (
  <div className="bg-white rounded-lg shadow p-6 flex items-center">
    <div className={`rounded-full p-3 mr-4 ${color}`}>{icon}</div>
    <div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      {loading ? (
        <div className="animate-pulse h-6 w-20 bg-gray-200 rounded"></div>
      ) : (
        <p className="text-2xl font-semibold">{value}</p>
      )}
    </div>
  </div>
);

// Chart component placeholder
const Chart: React.FC<{ data: any[]; title: string; loading: boolean }> = ({ data, title, loading }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-medium mb-4">{title}</h3>
    {loading ? (
      <div className="animate-pulse h-64 w-full bg-gray-200 rounded"></div>
    ) : (
      <div className="h-64 w-full bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">
          {data.length > 0 
            ? `Revenue chart with ${data.length} data points would render here` 
            : "No data available for the selected period"}
        </p>
      </div>
    )}
  </div>
);

// Recent orders table
const RecentOrdersTable: React.FC<{ orders: any[]; loading: boolean }> = ({ orders, loading }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="p-6 border-b">
      <h3 className="text-lg font-medium">Recent Orders</h3>
    </div>
    <div className="overflow-x-auto">
      {loading ? (
        <div className="p-6 flex justify-center">
          <Loader className="animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="p-6 text-center text-gray-500">No recent orders found</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  {order.orderNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.user?.name || 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
);

// Top products table
const TopProductsTable: React.FC<{ products: any[]; loading: boolean }> = ({ products, loading }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="p-6 border-b">
      <h3 className="text-lg font-medium">Top Products</h3>
    </div>
    <div className="overflow-x-auto">
      {loading ? (
        <div className="p-6 flex justify-center">
          <Loader className="animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="p-6 text-center text-gray-500">No products found</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sales
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      {product.images && product.images[0] ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={product.images[0]}
                          alt={product.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <Package size={16} />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(product.basePrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.salesCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  // Check if user has permission to access dashboard
  const hasAccess = useSelector((state) => selectHasPermission(state, 'admin:dashboard'));

  // Fetch dashboard stats
  const { data, error, isLoading, isFetching } = useGetDashboardStatsQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  // Redirect if user doesn't have access
  React.useEffect(() => {
    if (!hasAccess) {
      navigate('/');
    }
  }, [hasAccess, navigate]);

  if (!hasAccess) {
    return null;
  }

  const loading = isLoading || isFetching;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <SEOHead title="Admin Dashboard | LuxeHome" noIndex={true} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Overview of your store's performance</p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center mb-6">
          <AlertCircle className="mr-2" size={20} />
          <span>Error loading dashboard data. Please try again later.</span>
        </div>
      ) : null}

      {/* Date range selector */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:space-x-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
          />
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(data?.data.overview.totalRevenue || 0)}
          icon={<DollarSign className="text-white" size={20} />}
          color="bg-green-500"
          loading={loading}
        />
        <StatCard
          title="Total Orders"
          value={data?.data.overview.totalOrders || 0}
          icon={<ShoppingBag className="text-white" size={20} />}
          color="bg-blue-500"
          loading={loading}
        />
        <StatCard
          title="Total Users"
          value={data?.data.overview.totalUsers || 0}
          icon={<Users className="text-white" size={20} />}
          color="bg-purple-500"
          loading={loading}
        />
        <StatCard
          title="Low Stock Products"
          value={data?.data.overview.lowStockProducts || 0}
          icon={<AlertCircle className="text-white" size={20} />}
          color="bg-red-500"
          loading={loading}
        />
      </div>

      {/* Revenue chart */}
      <div className="mb-6">
        <Chart
          data={data?.data.revenueByDay || []}
          title="Revenue Trend"
          loading={loading}
        />
      </div>

      {/* Tables section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
        <RecentOrdersTable
          orders={data?.data.recentOrders || []}
          loading={loading}
        />
        <TopProductsTable
          products={data?.data.topProducts || []}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Dashboard;
