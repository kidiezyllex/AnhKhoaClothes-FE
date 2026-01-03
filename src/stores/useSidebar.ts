import { create } from 'zustand';

interface SidebarState {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const useSidebar = create<SidebarState>()((set) => ({
  isSidebarOpen: false, 
  setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
}));

export default useSidebar;
