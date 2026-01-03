import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { POSCartItem } from './usePOSCartStore';

export interface PendingCart {
  id: string;
  name: string;
  items: POSCartItem[];
  appliedDiscount: number;
  appliedVoucher: any | null;
  couponCode: string;
  createdAt: string;
  updatedAt: string;
}

interface PendingCartsState {
  carts: PendingCart[];
  activeCartId: string | null;
  maxCarts: number;
  
  // Actions
  createNewCart: () => string | null;
  deleteCart: (cartId: string) => void;
  setActiveCart: (cartId: string) => void;
  updateCart: (cartId: string, updates: Partial<Omit<PendingCart, 'id' | 'createdAt'>>) => void;
  getActiveCart: () => PendingCart | null;
  clearAllCarts: () => void;
  
  // Cart content actions
  addItemToCart: (cartId: string, item: POSCartItem) => void;
  removeItemFromCart: (cartId: string, itemId: string) => void;
  updateItemQuantityInCart: (cartId: string, itemId: string, amount: number) => void;
  clearCartItems: (cartId: string) => void;
  setCartDiscount: (cartId: string, discount: number, voucher?: any, couponCode?: string) => void;
}

export const usePendingCartsStore = create<PendingCartsState>()(
  persist(
    (set, get) => ({
      carts: [],
      activeCartId: null,
      maxCarts: 5,

      createNewCart: () => {
        const { carts, maxCarts } = get();
        
        if (carts.length >= maxCarts) {
          return null; // Indicate failure
        }

        const newCartId = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newCart: PendingCart = {
          id: newCartId,
          name: `Giỏ hàng ${carts.length + 1}`,
          items: [],
          appliedDiscount: 0,
          appliedVoucher: null,
          couponCode: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          carts: [...state.carts, newCart],
          activeCartId: newCartId,
        }));

        return newCartId;
      },

      deleteCart: (cartId: string) => {
        set((state) => {
          const newCarts = state.carts.filter(cart => cart.id !== cartId);
          let newActiveCartId = state.activeCartId;
          
          // If we're deleting the active cart, switch to another one
          if (state.activeCartId === cartId) {
            newActiveCartId = newCarts.length > 0 ? newCarts[0].id : null;
          }
          
          // Rename remaining carts to maintain sequential numbering
          const renamedCarts = newCarts.map((cart, index) => ({
            ...cart,
            name: `Giỏ hàng ${index + 1}`,
            updatedAt: new Date().toISOString(),
          }));

          return {
            carts: renamedCarts,
            activeCartId: newActiveCartId,
          };
        });
      },

      setActiveCart: (cartId: string) => {
        const { carts } = get();
        const cartExists = carts.some(cart => cart.id === cartId);
        
        if (cartExists) {
          set({ activeCartId: cartId });
        }
      },

      updateCart: (cartId: string, updates: Partial<Omit<PendingCart, 'id' | 'createdAt'>>) => {
        set((state) => ({
          carts: state.carts.map(cart =>
            cart.id === cartId
              ? { ...cart, ...updates, updatedAt: new Date().toISOString() }
              : cart
          ),
        }));
      },

      getActiveCart: () => {
        const { carts, activeCartId } = get();
        return carts.find(cart => cart.id === activeCartId) || null;
      },

      clearAllCarts: () => {
        set({
          carts: [],
          activeCartId: null,
        });
      },

      // Cart content actions
      addItemToCart: (cartId: string, item: POSCartItem) => {
        set((state) => ({
          carts: state.carts.map(cart => {
            if (cart.id !== cartId) return cart;
            
            const existingItemIndex = cart.items.findIndex(existingItem => existingItem.id === item.id);
            let newItems;
            
            if (existingItemIndex >= 0) {
              // Update existing item quantity
              newItems = cart.items.map((existingItem, index) =>
                index === existingItemIndex
                  ? { ...existingItem, quantity: existingItem.quantity + item.quantity }
                  : existingItem
              );
            } else {
              // Add new item
              newItems = [...cart.items, item];
            }
            
            return {
              ...cart,
              items: newItems,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      removeItemFromCart: (cartId: string, itemId: string) => {
        set((state) => ({
          carts: state.carts.map(cart =>
            cart.id === cartId
              ? {
                  ...cart,
                  items: cart.items.filter(item => item.id !== itemId),
                  updatedAt: new Date().toISOString(),
                }
              : cart
          ),
        }));
      },

      updateItemQuantityInCart: (cartId: string, itemId: string, amount: number) => {
        set((state) => ({
          carts: state.carts.map(cart => {
            if (cart.id !== cartId) return cart;
            
            const newItems = cart.items.map(item => {
              if (item.id !== itemId) return item;
              
              const newQuantity = item.quantity + amount;
              return newQuantity <= 0 ? null : { ...item, quantity: newQuantity };
            }).filter(Boolean) as POSCartItem[];
            
            return {
              ...cart,
              items: newItems,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      clearCartItems: (cartId: string) => {
        set((state) => ({
          carts: state.carts.map(cart =>
            cart.id === cartId
              ? {
                  ...cart,
                  items: [],
                  appliedDiscount: 0,
                  appliedVoucher: null,
                  couponCode: '',
                  updatedAt: new Date().toISOString(),
                }
              : cart
          ),
        }));
      },

      setCartDiscount: (cartId: string, discount: number, voucher?: any, couponCode?: string) => {
        set((state) => ({
          carts: state.carts.map(cart =>
            cart.id === cartId
              ? {
                  ...cart,
                  appliedDiscount: discount,
                  appliedVoucher: voucher || null,
                  couponCode: couponCode || '',
                  updatedAt: new Date().toISOString(),
                }
              : cart
          ),
        }));
      },
    }),
    {
      name: 'pending-carts-storage',
      version: 1,
    }
  )
); 