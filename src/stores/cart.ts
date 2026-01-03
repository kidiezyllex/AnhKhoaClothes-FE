import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
  variant?: {
    colorId?: string;
    sizeId?: string;
    name?: string;
  };
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      total: 0,
      addItem: (item) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) =>
              i.product.id === item.product.id &&
              i.variant?.colorId === item.variant?.colorId &&
              i.variant?.sizeId === item.variant?.sizeId
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += item.quantity;
            return {
              items: updatedItems,
              total: calculateTotal(updatedItems),
            };
          }

          const newItems = [...state.items, item];
          return {
            items: newItems,
            total: calculateTotal(newItems),
          };
        }),
      removeItem: (productId, variantId) =>
        set((state) => {
          const newItems = state.items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                (!variantId ||
                  (item.variant?.colorId === variantId.split('-')[0] &&
                    item.variant?.sizeId === variantId.split('-')[1]))
              )
          );
          return {
            items: newItems,
            total: calculateTotal(newItems),
          };
        }),
      updateQuantity: (productId, quantity, variantId) =>
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (
              item.product.id === productId &&
              (!variantId ||
                (item.variant?.colorId === variantId.split('-')[0] &&
                  item.variant?.sizeId === variantId.split('-')[1]))
            ) {
              return { ...item, quantity };
            }
            return item;
          });
          return {
            items: updatedItems,
            total: calculateTotal(updatedItems),
          };
        }),
      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: 'cart-storage',
    }
  )
);

const calculateTotal = (items: CartItem[]) => {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}; 