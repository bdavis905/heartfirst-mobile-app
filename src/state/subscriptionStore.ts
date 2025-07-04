import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SubscriptionState {
  // Free trial
  freeScansUsed: number;
  maxFreeScans: number;
  
  // Subscription
  isSubscribed: boolean;
  monthlyScansUsed: number;
  maxMonthlyScans: number;
  subscriptionDate: string | null;
  
  // Actions
  useScan: () => boolean; // Returns true if scan is allowed
  resetMonthlyScans: () => void;
  subscribe: () => void;
  unsubscribe: () => void;
  getRemainingScans: () => number;
  getSubscriptionStatus: () => 'free_trial' | 'subscribed' | 'expired';
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      // Initial state
      freeScansUsed: 0,
      maxFreeScans: 5,
      isSubscribed: false,
      monthlyScansUsed: 0,
      maxMonthlyScans: 50,
      subscriptionDate: null,

      // Use a scan - returns true if allowed, false if blocked
      useScan: () => {
        const state = get();
        
        if (!state.isSubscribed) {
          // Free trial logic
          if (state.freeScansUsed >= state.maxFreeScans) {
            return false; // Blocked - need to subscribe
          }
          
          set((state) => ({
            freeScansUsed: state.freeScansUsed + 1,
          }));
          return true;
        } else {
          // Subscribed user logic
          if (state.monthlyScansUsed >= state.maxMonthlyScans) {
            return false; // Blocked - monthly limit reached
          }
          
          set((state) => ({
            monthlyScansUsed: state.monthlyScansUsed + 1,
          }));
          return true;
        }
      },

      // Reset monthly scans (would be called on subscription renewal)
      resetMonthlyScans: () => {
        set({ monthlyScansUsed: 0 });
      },

      // Subscribe to premium
      subscribe: () => {
        const now = new Date().toISOString();
        set({
          isSubscribed: true,
          subscriptionDate: now,
          monthlyScansUsed: 0, // Reset monthly counter
        });
      },

      // Unsubscribe (for testing)
      unsubscribe: () => {
        set({
          isSubscribed: false,
          subscriptionDate: null,
          monthlyScansUsed: 0,
        });
      },

      // Get remaining scans
      getRemainingScans: () => {
        const state = get();
        
        if (!state.isSubscribed) {
          return state.maxFreeScans - state.freeScansUsed;
        } else {
          return state.maxMonthlyScans - state.monthlyScansUsed;
        }
      },

      // Get subscription status
      getSubscriptionStatus: () => {
        const state = get();
        
        if (!state.isSubscribed) {
          return state.freeScansUsed >= state.maxFreeScans ? 'expired' : 'free_trial';
        } else {
          return 'subscribed';
        }
      },
    }),
    {
      name: 'subscription-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);