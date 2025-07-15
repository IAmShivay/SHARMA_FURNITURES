import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  selectHasPermission, 
  selectUser, 
  selectIsTokenExpiring,
  selectIsAuthenticated
} from '../../store/slices/authSlice';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Package, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  User,
  Bell
} from 'lucide-react';
import { useLogoutMutation } from '../../store/api/authApi';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isTokenExpiring = useSelector(selectIsTokenExpiring);
  const hasAdminAccess = useSelector((state) => selectHasPermission(state, 'admin:access'));
  const [logout] = useLogoutMutation();

  // Check if user is authenticated and has admin access
  React.useEffect(() => {
    if (!isAuthenticated || !hasAdminAccess) {
      navigate('/login', { state: { from: '/admin' } });
    }
  }, [isAuthenticated, hasAdminAccess, navigate]);

  // Handle token expiration
  React.useEffect(() => {
    if (isTokenExpiring) {
      // Show a notification or handle token refresh
      console.log('Token is expiring soon');
    }
  }, [isTokenExpiring]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Navigation items with permission checks
  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard size={20} />,
      permission: 'admin:dashboard'
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: <Users size={20} />,
      permission: 'users:read_all'
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: <ShoppingBag size={20} />,
      permission: 'orders:read_all'
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: <Package size={20} />,
      permission: 'products:read_all'
    },
    {
      name: 'Analytics',
      path: '/admin/analytics',
      icon: <BarChart3 size={20} />,
      permission: 'admin:analytics'
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: <Settings size={20} />,
      permission: 'admin:settings'
    }
  ];

  if (!isAuthenticated || !hasAdminAccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75" 
          onClick={() => setSidebarOpen(false)}
        ></div>
        
        {/* Sidebar */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">Furniture Admin</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navItems.map((item) => {
                const hasPermission = useSelector((state) => selectHasPermission(state, item.permission));
                if (!hasPermission) return null;
                
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                    end={item.path === '/admin'}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="mr-4 flex-shrink-0 text-gray-500">{item.icon}</div>
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex-shrink-0 group block w-full flex items-center"
            >
              <div className="flex items-center">
                <div>
                  {user?.avatar ? (
                    <img
                      className="inline-block h-10 w-10 rounded-full"
                      src={user.avatar}
                      alt={user.name}
                    />
                  ) : (
                    <div className="inline-block h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={20} className="text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                    {user?.name}
                  </p>
                  <div className="flex items-center text-sm font-medium text-red-500 group-hover:text-red-700">
                    <LogOut size={16} className="mr-1" />
                    Logout
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">Furniture Admin</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              {navItems.map((item) => {
                const hasPermission = useSelector((state) => selectHasPermission(state, item.permission));
                if (!hasPermission) return null;
                
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                    end={item.path === '/admin'}
                  >
                    <div className="mr-3 flex-shrink-0 text-gray-500">{item.icon}</div>
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex-shrink-0 w-full group block"
            >
              <div className="flex items-center">
                <div>
                  {user?.avatar ? (
                    <img
                      className="inline-block h-9 w-9 rounded-full"
                      src={user.avatar}
                      alt={user.name}
                    />
                  ) : (
                    <div className="inline-block h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={18} className="text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {user?.name}
                  </p>
                  <div className="flex items-center text-xs font-medium text-red-500 group-hover:text-red-700">
                    <LogOut size={14} className="mr-1" />
                    Logout
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col">
        {/* Top header */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-lg font-semibold text-gray-900 lg:hidden">Furniture Admin</h1>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notification bell */}
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <span className="sr-only">Open user menu</span>
                    {user?.avatar ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.avatar}
                        alt={user.name}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={16} className="text-gray-500" />
                      </div>
                    )}
                    <span className="hidden md:flex md:items-center ml-2">
                      <span className="text-sm font-medium text-gray-700 mr-1">{user?.name}</span>
                      <ChevronDown size={16} className="text-gray-400" />
                    </span>
                  </button>
                </div>
                
                {userMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <button
                      onClick={() => {
                        navigate('/account');
                        setUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Your Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate('/admin/settings');
                        setUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
