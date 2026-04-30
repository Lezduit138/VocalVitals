import { create } from 'zustand';

export const useStore = create((set) => ({
  isOffline: !navigator.onLine,
  setOfflineStatus: (status) => set({ isOffline: status }),

  user: null,
  login: (userData) => set({ user: userData }),
  logout: () => set({ user: null }),

  analysisResult: null,
  setAnalysisResult: (result) => set({ analysisResult: result }),
}));
