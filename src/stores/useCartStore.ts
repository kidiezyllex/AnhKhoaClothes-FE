import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // variant ID
  productId: string; // product ID
  name: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  hasDiscount?: boolean;
  image: string;
  quantity: number;
  slug: string;
  brand: string;
  colors?: string[];
  size?: string;
  stock?: number;
  // New variant information
  colorId: string;
  sizeId: string;
  colorName?: string;
  sizeName?: string;
}

export interface AppliedVoucher {
  code: string;
  discount: number;
  voucherId: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  maxDiscount?: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  appliedVoucher: AppliedVoucher | null;
  voucherDiscount: number;
  addToCart: (product: any, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setAppliedVoucher: (voucher: AppliedVoucher | null) => void;
  removeVoucher: () => void;
  calculateVoucherDiscount: () => number;
}

const calculateCartTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  return { totalItems, totalPrice };
};

const calculateTotals = (items: CartItem[], voucherDiscount: number = 0) => {
  // Tạm tính: Tổng giá trị các sản phẩm (đã áp dụng khuyến mãi)
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  
  // Thuế VAT 5%
  const tax = subtotal * 0.05;
  
  // Phí vận chuyển: Miễn phí nếu đơn hàng trên 500,000 VND, ngược lại 30,000 VND
  const shipping = subtotal >= 500000 ? 0 : 30000;
  
  // Tổng cộng (trừ voucher discount)
  const total = subtotal + tax + shipping - voucherDiscount;
  
  return { subtotal, tax, shipping, total };
};

export const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      appliedVoucher: null,
      voucherDiscount: 0,
      
      calculateVoucherDiscount: () => {
        const { appliedVoucher, items } = get();
        if (!appliedVoucher) return 0;
        
        // Calculate current subtotal from items
        const currentSubtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
        
        if (appliedVoucher.discountType === 'PERCENTAGE') {
          let discount = (currentSubtotal * appliedVoucher.discountValue) / 100;
          // Apply max discount if exists
          if (appliedVoucher.maxDiscount && discount > appliedVoucher.maxDiscount) {
            discount = appliedVoucher.maxDiscount;
          }
          return discount;
        } else {
          return Math.min(appliedVoucher.discountValue, currentSubtotal);
        }
      },
      
      setAppliedVoucher: (voucher) => {
        set({ appliedVoucher: voucher });
        // Recalculate after setting voucher
        const state = get();
        const voucherDiscount = voucher ? state.calculateVoucherDiscount() : 0;
        const { subtotal, tax, shipping, total } = calculateTotals(state.items, voucherDiscount);
        set({ voucherDiscount, subtotal, tax, shipping, total });
      },
      
      removeVoucher: () => {
        set({ appliedVoucher: null, voucherDiscount: 0 });
        const { subtotal, tax, shipping, total } = calculateTotals(get().items, 0);
        set({ subtotal, tax, shipping, total });
      },
      
      addToCart: (product, quantity) => {
        const currentItems = [...get().items];
        const existingItemIndex = currentItems.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
          const existingItem = currentItems[existingItemIndex];
          const newQuantity = existingItem.quantity + quantity;
          
          // Check stock limit
          if (existingItem.stock && newQuantity > existingItem.stock) {
            return; // Don't add if exceeds stock
          }
          
          currentItems[existingItemIndex].quantity = newQuantity;
        } else {
          // Check stock for new item
          if (product.stock && quantity > product.stock) {
            return; // Don't add if exceeds stock
          }
          
          currentItems.push({
            id: product.id,
            productId: product.productId || product.id, // Default to id if productId not provided
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            discountPercent: product.discountPercent || 0,
            hasDiscount: Boolean(product.hasDiscount || (product.originalPrice && product.originalPrice > product.price)),
            image: product.image,
            quantity: quantity,
            slug: product.slug,
            brand: product.brand,
            colors: product.colors,
            size: product.size,
            stock: product.stock,
            colorId: product.colorId || '',
            sizeId: product.sizeId || '',
            colorName: product.colorName || '',
            sizeName: product.sizeName || '',
          });
        }
        
        const { totalItems, totalPrice } = calculateCartTotals(currentItems);
        const voucherDiscount = get().calculateVoucherDiscount();
        const { subtotal, tax, shipping, total } = calculateTotals(currentItems, voucherDiscount);
        
        set({ 
          items: currentItems, 
          totalItems, 
          totalPrice,
          subtotal,
          tax,
          shipping,
          total,
          voucherDiscount
        });
      },
      
      removeFromCart: (productId) => {
        const currentItems = get().items.filter(item => item.id !== productId);
        const { totalItems, totalPrice } = calculateCartTotals(currentItems);
        const voucherDiscount = get().calculateVoucherDiscount();
        const { subtotal, tax, shipping, total } = calculateTotals(currentItems, voucherDiscount);
        
        set({ 
          items: currentItems,
          totalItems,
          totalPrice,
          subtotal,
          tax,
          shipping,
          total,
          voucherDiscount
        });
      },
      
      updateQuantity: (productId, quantity) => {
        const currentItems = [...get().items];
        const itemIndex = currentItems.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
          const item = currentItems[itemIndex];
          // Check stock limit
          if (item.stock && quantity > item.stock) {
            currentItems[itemIndex].quantity = item.stock; // Set to max available stock
          } else if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            currentItems.splice(itemIndex, 1);
          } else {
            currentItems[itemIndex].quantity = quantity;
          }
          
          const { totalItems, totalPrice } = calculateCartTotals(currentItems);
          const voucherDiscount = get().calculateVoucherDiscount();
          const { subtotal, tax, shipping, total } = calculateTotals(currentItems, voucherDiscount);
          
          set({ 
            items: currentItems,
            totalItems,
            totalPrice,
            subtotal,
            tax,
            shipping,
            total,
            voucherDiscount
          });
        }
      },
      
      clearCart: () => {
        set({ 
          items: [],
          totalItems: 0,
          totalPrice: 0,
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0,
          appliedVoucher: null,
          voucherDiscount: 0
        });
      }
    }),
    {
      name: 'cart-storage',
    }
  )
); 