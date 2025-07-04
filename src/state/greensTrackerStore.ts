import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface GreensServing {
  id: string;
  time: string;
  completed: boolean;
  timestamp?: number;
  type?: string; // e.g., "spinach", "kale", "arugula"
}

export interface DailyGreensData {
  date: string; // YYYY-MM-DD format
  servings: GreensServing[];
  goal: number;
  completed: number;
}

interface GreensTrackerState {
  // Current day data
  currentDate: string;
  dailyGoal: number;
  servings: GreensServing[];
  
  // Historical data
  history: Record<string, DailyGreensData>;
  
  // Actions
  initializeDay: (date: string) => void;
  addServing: (type?: string) => void;
  toggleServing: (servingId: string) => void;
  getProgressPercentage: () => number;
  getCompletedServings: () => number;
  getTodaysData: () => DailyGreensData;
  getWeeklyData: () => DailyGreensData[];
  resetDay: () => void;
}

const generateDefaultServings = (): GreensServing[] => {
  const times = [
    '7:00 AM',   // Morning
    '10:00 AM',  // Mid-morning
    '1:00 PM',   // Lunch
    '4:00 PM',   // Afternoon
    '7:00 PM',   // Dinner
    '9:00 PM',   // Evening
  ];

  return times.map((time, index) => ({
    id: `serving-${index + 1}`,
    time,
    completed: false,
  }));
};

const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const useGreensTrackerStore = create<GreensTrackerState>()(
  persist(
    (set, get) => ({
      currentDate: getTodayDateString(),
      dailyGoal: 6,
      servings: generateDefaultServings(),
      history: {},

      initializeDay: (date: string) => {
        const state = get();
        
        // Save current day to history if it's a different day
        if (state.currentDate !== date && state.servings.some(s => s.completed)) {
          const currentDayData: DailyGreensData = {
            date: state.currentDate,
            servings: state.servings,
            goal: state.dailyGoal,
            completed: state.servings.filter(s => s.completed).length,
          };
          
          set((state) => ({
            history: {
              ...state.history,
              [state.currentDate]: currentDayData,
            },
          }));
        }

        // Check if we have historical data for this date
        const historicalData = state.history[date];
        
        if (historicalData) {
          // Load historical data
          set({
            currentDate: date,
            servings: historicalData.servings,
          });
        } else {
          // Create new day
          set({
            currentDate: date,
            servings: generateDefaultServings(),
          });
        }
      },

      addServing: (type?: string) => {
        set((state) => {
          const nextIncompleteServing = state.servings.find(s => !s.completed);
          
          if (nextIncompleteServing) {
            const updatedServings = state.servings.map(serving =>
              serving.id === nextIncompleteServing.id
                ? {
                    ...serving,
                    completed: true,
                    timestamp: Date.now(),
                    type: type || 'greens',
                  }
                : serving
            );

            return { servings: updatedServings };
          }
          
          return state;
        });
      },

      toggleServing: (servingId: string) => {
        set((state) => ({
          servings: state.servings.map(serving =>
            serving.id === servingId
              ? {
                  ...serving,
                  completed: !serving.completed,
                  timestamp: serving.completed ? undefined : Date.now(),
                }
              : serving
          ),
        }));
      },

      getProgressPercentage: () => {
        const state = get();
        const completed = state.servings.filter(s => s.completed).length;
        return Math.round((completed / state.dailyGoal) * 100);
      },

      getCompletedServings: () => {
        const state = get();
        return state.servings.filter(s => s.completed).length;
      },

      getTodaysData: () => {
        const state = get();
        return {
          date: state.currentDate,
          servings: state.servings,
          goal: state.dailyGoal,
          completed: state.servings.filter(s => s.completed).length,
        };
      },

      getWeeklyData: () => {
        const state = get();
        const weekData: DailyGreensData[] = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateString = date.toISOString().split('T')[0];
          
          const dayData = state.history[dateString] || {
            date: dateString,
            servings: generateDefaultServings(),
            goal: 6,
            completed: 0,
          };
          
          // If it's today, use current data
          if (dateString === state.currentDate) {
            weekData.push(state.getTodaysData());
          } else {
            weekData.push(dayData);
          }
        }
        
        return weekData;
      },

      resetDay: () => {
        set({
          servings: generateDefaultServings(),
        });
      },
    }),
    {
      name: 'greens-tracker-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);