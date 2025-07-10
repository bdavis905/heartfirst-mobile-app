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
  
  // Schedule settings
  startTime: string; // Format: "HH:MM"
  endTime: string;   // Format: "HH:MM"
  
  // Historical data
  history: Record<string, DailyGreensData>;
  
  // Actions
  initializeDay: (date: string) => void;
  addServing: (type?: string) => void;
  toggleServing: (servingId: string) => void;
  updateSchedule: (startTime: string, endTime: string) => void;
  getProgressPercentage: () => number;
  getCompletedServings: () => number;
  getTodaysData: () => DailyGreensData;
  getWeeklyData: () => DailyGreensData[];
  resetDay: () => void;
}

const generateServingsFromSchedule = (startTime: string, endTime: string): GreensServing[] => {
  // Parse start and end times
  const parseTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes; // Convert to minutes from midnight
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  const startMinutes = parseTime(startTime);
  const endMinutes = parseTime(endTime);
  
  // Calculate interval between servings (divide the time span by 5 to get 6 total servings)
  const totalSpan = endMinutes - startMinutes;
  const interval = totalSpan / 5; // 5 intervals for 6 servings
  
  const times: string[] = [];
  for (let i = 0; i < 6; i++) {
    const servingTime = startMinutes + (interval * i);
    times.push(formatTime(Math.round(servingTime)));
  }

  return times.map((time, index) => ({
    id: `serving-${index + 1}`,
    time,
    completed: false,
  }));
};

const generateDefaultServings = (): GreensServing[] => {
  // Default schedule: 7:00 AM to 9:00 PM
  return generateServingsFromSchedule('07:00', '21:00');
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
      startTime: '07:00', // 7:00 AM
      endTime: '21:00',   // 9:00 PM
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

      updateSchedule: (startTime: string, endTime: string) => {
        const newServings = generateServingsFromSchedule(startTime, endTime);
        set({
          startTime,
          endTime,
          servings: newServings,
        });
      },

      resetDay: () => {
        const state = get();
        set({
          servings: generateServingsFromSchedule(state.startTime, state.endTime),
        });
      },
    }),
    {
      name: 'greens-tracker-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);