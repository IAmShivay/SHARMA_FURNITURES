import { useCallback } from 'react';
import { useAppDispatch } from '../store/hooks';
import { useAuth } from './useAuth';
import { useLocalStorage } from './useLocalStorage';
import { addNotification } from '../store/slices/uiSlice';
import { 
  useGetWishlistQuery, 
  useAddToWishlistMutation, 
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
  type WishlistItem
} from '../store/api/wishlistApi';

export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  
  // For non-authenticated users, use localStorage
  const [localWishlist, setLocalWishlist] = useLocalStorage<string[]>('wishlist', []);
  
  // For authenticated users, use RTK Query
  const { data: wishlistData, isLoading: isWishlistLoading } = useGetWishlistQuery(undefined, { 
    skip: !isAuthenticated 
  });
  
  const [addToWishlistMutation] = useAddToWishlistMutation();
  const [removeFromWishlistMutation] = useRemoveFromWishlistMutation();
  const [clearWishlistMutation] = useClearWishlistMutation();
  
  // Use server data for authenticated users, localStorage for guests
  const wishlistItems: WishlistItem[] = isAuthenticated 
    ? (wishlistData?.data || []) 
    : [];
    
  const wishlist = isAuthenticated 
    ? wishlistItems.map(item => item.productId)
    : localWishlist;
  
  const addToWishlist = useCallback(async (productId: string, productName: string) => {
    try {
      if (isAuthenticated) {
        await addToWishlistMutation(productId).unwrap();
        
        dispatch(addNotification({
          type: 'success',
          title: 'Added to Wishlist',
          message: `${productName} has been added to your wishlist!`,
          duration: 3000,
        }));
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
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to add item to wishlist. Please try again.',
        duration: 3000,
      }));
    }
  }, [isAuthenticated, localWishlist, setLocalWishlist, dispatch, addToWishlistMutation]);
  
  const removeFromWishlist = useCallback(async (productId: string, productName: string) => {
    try {
      if (isAuthenticated) {
        await removeFromWishlistMutation(productId).unwrap();
        
        dispatch(addNotification({
          type: 'info',
          title: 'Removed from Wishlist',
          message: `${productName} has been removed from your wishlist.`,
          duration: 3000,
        }));
      } else {
        setLocalWishlist(prev => prev.filter(id => id !== productId));
        
        dispatch(addNotification({
          type: 'info',
          title: 'Removed from Wishlist',
          message: `${productName} has been removed from your wishlist.`,
          duration: 3000,
        }));
      }
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to remove item from wishlist. Please try again.',
        duration: 3000,
      }));
    }
  }, [isAuthenticated, setLocalWishlist, dispatch, removeFromWishlistMutation]);
  
  const isInWishlist = useCallback((productId: string) => {
    return wishlist.includes(productId);
  }, [wishlist]);
  
  const toggleWishlist = useCallback((productId: string, productName: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId, productName);
    } else {
      addToWishlist(productId, productName);
    }
  }, [addToWishlist, removeFromWishlist, isInWishlist]);
  
  const clearWishlist = useCallback(async () => {
    try {
      if (isAuthenticated) {
        await clearWishlistMutation().unwrap();
        
        dispatch(addNotification({
          type: 'info',
          title: 'Wishlist Cleared',
          message: 'All items have been removed from your wishlist.',
          duration: 3000,
        }));
      } else {
        setLocalWishlist([]);
        
        dispatch(addNotification({
          type: 'info',
          title: 'Wishlist Cleared',
          message: 'All items have been removed from your wishlist.',
          duration: 3000,
        }));
      }
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to clear wishlist. Please try again.',
        duration: 3000,
      }));
    }
  }, [isAuthenticated, setLocalWishlist, dispatch, clearWishlistMutation]);
  
  return {
    wishlist,
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: wishlist.length,
    isLoading: isWishlistLoading,
  };
};
