import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { IProduct } from '@/interface/response/products'

interface SelectedProductState {
  selectedProduct: IProduct | null
  setSelectedProduct: (product: IProduct) => void
  clearSelectedProduct: () => void
}

export const useSelectedProduct = create(
  persist<SelectedProductState>(
    (set) => ({
      selectedProduct: null,
      setSelectedProduct: (product: IProduct) => set({ selectedProduct: product }),
      clearSelectedProduct: () => set({ selectedProduct: null }),
    }),
    {
      name: 'selected-product-storage',
    }
  )
) 