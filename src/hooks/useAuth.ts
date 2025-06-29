import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setCredentials,
  logout as logoutAction,
  setLoading,
  setError,
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectUserRole
} from '../store/slices/authSlice';
import {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useLogoutMutation
} from '../store/api/authApi';

export const useAuth = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const userRole = useAppSelector(selectUserRole);

  // Mutations
  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();

  // Auto-fetch profile if token exists
  const { data: profileData, isLoading: profileLoading } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const login = useCallback(async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      const result = await loginMutation({ email, password }).unwrap();

      if (result.success) {
        dispatch(setCredentials(result.data));
        return { success: true, user: result.data.user };
      } else {
        dispatch(setError(result.message));
        return { success: false, error: result.message };
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Login failed';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, loginMutation]);

  const register = useCallback(async (name: string, email: string, password: string, phone?: string) => {
    try {
      dispatch(setLoading(true));
      const result = await registerMutation({ name, email, password, phone }).unwrap();

      if (result.success) {
        dispatch(setCredentials(result.data));
        return { success: true, user: result.data.user };
      } else {
        dispatch(setError(result.message));
        return { success: false, error: result.message };
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Registration failed';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, registerMutation]);

  const logout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error('Logout error:', error);
    } finally {
      dispatch(logoutAction());
    }
  }, [dispatch, logoutMutation]);

  // Role-based permissions
  const hasRole = useCallback((roles: string | string[]) => {
    if (!isAuthenticated || !userRole) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(userRole);
  }, [isAuthenticated, userRole]);

  const isAdmin = useCallback(() => hasRole('admin'), [hasRole]);
  const isManager = useCallback(() => hasRole(['admin', 'manager']), [hasRole]);
  const isSupport = useCallback(() => hasRole(['admin', 'manager', 'support']), [hasRole]);
  const isCustomer = useCallback(() => hasRole('customer'), [hasRole]);

  return {
    // State
    user,
    isAuthenticated,
    loading: loading || profileLoading,
    error,
    userRole,

    // Actions
    login,
    register,
    logout,

    // Permissions
    hasRole,
    isAdmin,
    isManager,
    isSupport,
    isCustomer,
  };
};
