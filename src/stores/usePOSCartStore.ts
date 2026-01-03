import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface POSCartItem {
  id: string; 
  productId: string;
  variantId: string; 
  name: string;
  colorName: string;
  colorCode?: string; 
  sizeName: string; 
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  hasDiscount?: boolean;
  quantity: number;
  image: string; 
  stock: number; 
  actualColorId?: string; 
  actualSizeId?: string; 
}

interface POSCartState {
  items: POSCartItem[];
  appliedDiscount: number;
  appliedVoucher: any | null;
  couponCode: string;
  addToCart: (item: POSCartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, amount: number) => void;
  clearCart: () => void;
  setDiscount: (discount: number) => void;
  setVoucher: (voucher: any | null) => void;
  setCouponCode: (code: string) => void;
  calculateSubtotal: () => number;
  calculateTotal: () => number;
}

export const usePOSCartStore = create(
  persist<POSCartState>(
    (set, get) => ({
      items: [],
      appliedDiscount: 0,
      appliedVoucher: null,
      couponCode: '',
      
      addToCart: (newItem) => {
        const currentItems = [...get().items];
        const existingItemIndex = currentItems.findIndex(item => item.id === newItem.id);
        
        if (existingItemIndex >= 0) {
          if (currentItems[existingItemIndex].quantity < newItem.stock) {
            currentItems[existingItemIndex].quantity += 1;
          } else {
            return; // Don't add if exceeds stock
          }
        } else {
          // Ensure discount information is properly set
          const itemToAdd = {
            ...newItem,
            hasDiscount: Boolean(newItem.hasDiscount || (newItem.originalPrice && newItem.originalPrice > newItem.price)),
            discountPercent: newItem.discountPercent || 0
          };
          currentItems.push(itemToAdd);
        }
        
        set({ items: currentItems });
      },
      
      removeFromCart: (id) => {
        const updatedItems = get().items.filter(item => item.id !== id);
        set({ items: updatedItems });
      },
      
      updateQuantity: (id, amount) => {
        const updatedItems = get().items.map(item => {
          if (item.id === id) {
            const newQuantity = item.quantity + amount;
            if (newQuantity <= 0) return null; // Mark for removal
            if (newQuantity > item.stock) {
              return {...item, quantity: item.stock };
            }
            return { ...item, quantity: newQuantity };
          }
          return item;
        }).filter((item): item is POSCartItem => item !== null && item.quantity > 0);
        
        set({ items: updatedItems });
      },
      
      clearCart: () => {
        set({ 
          items: [],
          appliedDiscount: 0,
          appliedVoucher: null,
          couponCode: ''
        });
      },
      
      setDiscount: (discount) => {
        set({ appliedDiscount: discount });
      },
      
      setVoucher: (voucher) => {
        set({ appliedVoucher: voucher });
      },
      
      setCouponCode: (code) => {
        set({ couponCode: code });
      },
      
      calculateSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
      
      calculateTotal: () => {
        const subtotal = get().calculateSubtotal();
        return subtotal - get().appliedDiscount;
      }
    }),
    {
      name: 'pos-cart-storage',
    }
  )
); 