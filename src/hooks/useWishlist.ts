import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useAuth } from './useAuth';
import { useLocalStorage } from './useLocalStorage';
import { addNotification } from '../store/slices/uiSlice';

export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  
  // For non-authenticated users, use localStorage
  const [localWishlist, setLocalWishlist] = useLocalStorage<string[]>('wishlist', []);
  
  // For authenticated users, we would use server state
  // const { data: serverWishlist } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
  
  const wishlist = isAuthenticated ? [] : localWishlist; // Replace with server data when available
  
  const addToWishlist = useCallback((productId: string, productName: string) => {
    if (isAuthenticated) {
      // TODO: Add server mutation
      // addToServerWishlist(productId);
    } else {
      if (!localWishlist.includes(productId)) {
        setLocalWishlist(prev => [...prev, productId]);
        
        dispatch(addNotification({
          type: 'success',
          title: 'Added to Wishlist',
          message: `${productName} has been added to your wishlist!`,
          duration: 3000,
        }));
      }
    }
  }, [isAuthenticated, localWishlist, setLocalWishlist, dispatch]);
  
  const removeFromWishlist = useCallback((productId: string, productName: string) => {
    if (isAuthenticated) {
      // TODO: Add server mutation
      // removeFromServerWishlist(productId);
    } else {
      setLocalWishlist(prev => prev.filter(id => id !== productId));
      
      dispatch(addNotification({
        type: 'info',
        title: 'Removed from Wishlist',
        message: `${productName} has been removed from your wishlist.`,
        duration: 3000,
      }));
    }
  }, [isAuthenticated, setLocalWishlist, dispatch]);
  
  const toggleWishlist = useCallback((productId: string, productName: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId, productName);
    } else {
      addToWishlist(productId, productName);
    }
  }, [addToWishlist, removeFromWishlist]);
  
  const isInWishlist = useCallback((productId: string) => {
    return wishlist.includes(productId);
  }, [wishlist]);
  
  const clearWishlist = useCallback(() => {
    if (isAuthenticated) {
      // TODO: Add server mutation
      // clearServerWishlist();
    } else {
      setLocalWishlist([]);
      
      dispatch(addNotification({
        type: 'info',
        title: 'Wishlist Cleared',
        message: 'All items have been removed from your wishlist.',
        duration: 3000,
      }));
    }
  }, [isAuthenticated, setLocalWishlist, dispatch]);
  
  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: wishlist.length,
  };
};
