import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Stats {
  dailySales: number;
  totalOrders: number;
  averageOrder: number;
  pendingOrders: number;
}

interface PosState {
  stats: Stats;
  setStats: (newStats: Stats) => void;
  updateStatsOnCheckout: (orderTotal: number) => void;
}

const initialStats: Stats = {
  dailySales: 12500000,
  totalOrders: 24,
  averageOrder: 520000,
  pendingOrders: 3,
};

export const usePosStore = create<PosState>()(
  persist(
    (set, get) => ({
      stats: initialStats,
      setStats: (newStats) => set({ stats: newStats }),
      updateStatsOnCheckout: (orderTotal) => {
        const currentStats = get().stats;
        const newDailySales = currentStats.dailySales + orderTotal;
        const newTotalOrders = currentStats.totalOrders + 1;
        const newAverageOrder = Math.round(newDailySales / newTotalOrders);

        set({ 
          stats: {
            ...currentStats,
            dailySales: newDailySales,
            totalOrders: newTotalOrders,
            averageOrder: newAverageOrder,
          } 
        });
      },
    }),
    {
      name: 'pos-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
); 