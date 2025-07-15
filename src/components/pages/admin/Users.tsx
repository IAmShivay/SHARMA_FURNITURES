import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectHasPermission } from '../../../store/slices/authSlice';
import { 
  useGetUsersQuery, 
  useUpdateUserRoleMutation, 
  useUpdateUserStatusMutation 
} from '../../../store/api/adminApi';
import { 
  Loader, 
  AlertCircle, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Check,
  X,
  Edit,
  User,
  Shield
} from 'lucide-react';

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<boolean | undefined>(undefined);
  const [editingUser, setEditingUser] = useState<{
    id: string;
    role: 'customer' | 'support' | 'manager' | 'admin';
  } | null>(null);

  // Check if user has permission to access user management
  const hasAccess = useSelector((state) => selectHasPermission(state, 'users:read_all'));
  const canManageRoles = useSelector((state) => selectHasPermission(state, 'users:manage_roles'));

  // Fetch users with filters
  const { data, error, isLoading, isFetching } = useGetUsersQuery({
    page: currentPage,
    limit,
    search: searchTerm || undefined,
    role: selectedRole,
    isActive: selectedStatus,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Mutations for user management
  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
  const [updateUserStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation();

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

  // Handle role change
  const handleRoleChange = async (userId: string, role: 'customer' | 'support' | 'manager' | 'admin') => {
    if (!canManageRoles) return;
    
    try {
      await updateUserRole({ id: userId, role }).unwrap();
      setEditingUser(null);
    } catch (err) {
      console.error('Failed to update user role:', err);
    }
  };

  // Handle status change
  const handleStatusChange = async (userId: string, isActive: boolean) => {
    try {
      await updateUserStatus({ id: userId, isActive }).unwrap();
    } catch (err) {
      console.error('Failed to update user status:', err);
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Get total pages
  const totalPages = data?.data.pagination.pages || 1;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500">Manage user accounts and permissions</p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center mb-6">
          <AlertCircle className="mr-2" size={20} />
          <span>Error loading users. Please try again later.</span>
        </div>
      ) : null}

      {/* Filters and search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or email"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </form>
          
          <div className="flex gap-4">
            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={selectedRole || ''}
              onChange={(e) => {
                setSelectedRole(e.target.value || undefined);
                setCurrentPage(1);
              }}
            >
              <option value="">All Roles</option>
              <option value="customer">Customer</option>
              <option value="support">Support</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            
            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={selectedStatus === undefined ? '' : selectedStatus ? 'active' : 'inactive'}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedStatus(value === '' ? undefined : value === 'active');
                setCurrentPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 flex justify-center">
              <Loader className="animate-spin" />
            </div>
          ) : data?.data.users.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No users found</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.data.users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {user.avatar ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={user.avatar}
                              alt={user.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User size={16} />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                      {user.emailVerified && (
                        <span className="ml-2 text-green-500">
                          <Check size={14} className="inline" />
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser?.id === user.id ? (
                        <select
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                          value={editingUser.role}
                          onChange={(e) => setEditingUser({ 
                            ...editingUser, 
                            role: e.target.value as 'customer' | 'support' | 'manager' | 'admin' 
                          })}
                        >
                          <option value="customer">Customer</option>
                          <option value="support">Support</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                            user.role === 'manager' ? 'bg-blue-100 text-blue-800' : 
                            user.role === 'support' ? 'bg-green-100 text-green-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {/* Role edit actions */}
                        {canManageRoles && (
                          <>
                            {editingUser?.id === user.id ? (
                              <>
                                <button
                                  onClick={() => handleRoleChange(user.id, editingUser.role)}
                                  disabled={isUpdatingRole}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <Check size={18} />
                                </button>
                                <button
                                  onClick={() => setEditingUser(null)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <X size={18} />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setEditingUser({ id: user.id, role: user.role })}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit size={18} />
                              </button>
                            )}
                          </>
                        )}
                        
                        {/* Status toggle */}
                        <button
                          onClick={() => handleStatusChange(user.id, !user.isActive)}
                          disabled={isUpdatingStatus}
                          className={`${user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                          title={user.isActive ? 'Deactivate user' : 'Activate user'}
                        >
                          {user.isActive ? <X size={18} /> : <Check size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        {data && totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((currentPage - 1) * limit) + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * limit, data.data.pagination.total)}
                  </span>{' '}
                  of <span className="font-medium">{data.data.pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                      currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {/* Page numbers */}
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    // Show current page, first, last, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    
                    // Show ellipsis for gaps
                    if (page === 2 || page === totalPages - 1) {
                      return (
                        <span
                          key={`ellipsis-${page}`}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }
                    
                    return null;
                  })}
                  
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                      currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
