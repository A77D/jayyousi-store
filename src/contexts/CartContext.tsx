import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.product.id === product.id);
      
      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { product, quantity }];
      }
      
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      return { items: newItems, totalItems, totalPrice };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.product.id !== action.payload.productId);
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      return { items: newItems, totalItems, totalPrice };
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { productId } });
      }
      
      const newItems = state.items.map(item =>
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      );
      
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      return { items: newItems, totalItems, totalPrice };
    }
    
    case 'CLEAR_CART':
      return initialState;
    
    default:
      return state;
  }
}

interface CartContextType extends CartState {
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  submitOrder: (customerInfo: any) => Promise<{ success: boolean; error?: string; orderId?: string }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  const addItem = (product: Product, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };
  
  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };
  
  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const submitOrder = async (customerInfo: any) => {
    try {
      // Calculate delivery price
      const deliveryZones = [
        { id: 'west-bank', name: 'الضفة الغربية', price: 20 },
        { id: 'jerusalem', name: 'القدس', price: 50 },
        { id: 'interior', name: 'الداخل المحتل', price: 70 }
      ];
      
      const selectedZone = deliveryZones.find(zone => zone.id === customerInfo.deliveryZone);
      const deliveryPrice = selectedZone?.price || 0;
      const finalTotal = state.totalPrice + deliveryPrice;
      
      // Get current user ID if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      // Create order with user_id if authenticated
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          full_name: customerInfo.fullName,
          phone_number: customerInfo.phoneNumber,
          address: `${selectedZone?.name || ''} - ${customerInfo.address}`,
          notes: customerInfo.notes,
          total_price: finalTotal,
          status: 'pending',
          user_id: user?.id || null
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = state.items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return { success: true, orderId: order.id };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'حدث خطأ غير متوقع' 
      };
    }
  };
  
  return (
    <CartContext.Provider value={{
      ...state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      submitOrder,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}