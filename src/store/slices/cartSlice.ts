import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  customization?: {
    woodType?: string;
    finish?: string;
    color?: string;
    assembly?: string;
    hardware?: string[];
    protection?: string;
    customizationCost?: number;
  };
  variant?: string;
  sku?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem('cartItems') || '[]'),
  total: 0,
  itemCount: 0,
  isOpen: false,
  loading: false,
  error: null,
};

// Calculate totals helper
const calculateTotals = (items: CartItem[]) => {
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce((total, item) => {
    const itemPrice = item.price + (item.customization?.customizationCost || 0);
    return total + (itemPrice * item.quantity);
  }, 0);
  
  return { itemCount, total };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    ...initialState,
    ...calculateTotals(initialState.items),
  },
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'> & { quantity?: number }>) => {
      const { quantity = 1, ...item } = action.payload;
      
      // Check if item already exists (considering customization)
      const existingItemIndex = state.items.findIndex(
        (cartItem) =>
          cartItem.productId === item.productId &&
          JSON.stringify(cartItem.customization) === JSON.stringify(item.customization)
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        state.items.push({ ...item, quantity });
      }
      
      // Recalculate totals
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
      
      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.items));
      
      state.error = null;
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      
      // Recalculate totals
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
      
      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        state.items = state.items.filter(item => item.id !== id);
      } else {
        // Update quantity
        const itemIndex = state.items.findIndex(item => item.id === id);
        if (itemIndex >= 0) {
          state.items[itemIndex].quantity = quantity;
        }
      }
      
      // Recalculate totals
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
      
      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      localStorage.removeItem('cartItems');
    },
    
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    
    openCart: (state) => {
      state.isOpen = true;
    },
    
    closeCart: (state) => {
      state.isOpen = false;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    // Sync cart with server (for authenticated users)
    syncCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
  setLoading,
  setError,
  clearError,
  syncCart,
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotal = (state: { cart: CartState }) => state.cart.total;
export const selectCartItemCount = (state: { cart: CartState }) => state.cart.itemCount;
export const selectCartIsOpen = (state: { cart: CartState }) => state.cart.isOpen;
export const selectCartLoading = (state: { cart: CartState }) => state.cart.loading;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;

// Get specific item from cart
export const selectCartItem = (productId: string, customization?: any) => 
  (state: { cart: CartState }) => 
    state.cart.items.find(
      item => 
        item.productId === productId && 
        JSON.stringify(item.customization) === JSON.stringify(customization)
    );

// Check if item is in cart
export const selectIsInCart = (productId: string, customization?: any) => 
  (state: { cart: CartState }) => 
    state.cart.items.some(
      item => 
        item.productId === productId && 
        JSON.stringify(item.customization) === JSON.stringify(customization)
    );
