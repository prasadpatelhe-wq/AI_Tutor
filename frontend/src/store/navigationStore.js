/**
 * Navigation Store - Zustand
 *
 * Global navigation state management
 */

import { create } from 'zustand';

export const useNavigationStore = create((set) => ({
  // State
  activeTab: 'home',
  subView: null, // 'chapter' | 'study' | null

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab, subView: null }),
  setSubView: (view) => set({ subView: view }),

  navigateTo: (tab, subView = null) => set({ activeTab: tab, subView }),

  goBack: () => set(state => {
    if (state.subView) {
      return { subView: null };
    }
    return { activeTab: 'home' };
  }),

  reset: () => set({ activeTab: 'home', subView: null }),
}));

export default useNavigationStore;
