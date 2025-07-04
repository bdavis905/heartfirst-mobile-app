import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useGreensTrackerStore } from '../state/greensTrackerStore';

interface GreensHistoryScreenProps {
  navigation?: {
    goBack: () => void;
  };
}

export default function GreensHistoryScreen({ navigation }: GreensHistoryScreenProps) {
  const insets = useSafeAreaInsets();
  const { getWeeklyData } = useGreensTrackerStore();
  
  const weeklyData = getWeeklyData();
  
  // Get day names for the week
  const getDayName = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateString === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (dateString === yesterday.toISOString().split('T')[0]) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
  };

  const getProgressColor = (completed: number, goal: number) => {
    const percentage = completed / goal;
    if (percentage === 1) return '#2ECC71'; // Complete - bright green
    if (percentage >= 0.8) return '#16A085'; // Almost complete - teal
    if (percentage >= 0.5) return '#F39C12'; // Halfway - orange
    if (percentage >= 0.2) return '#E74C3C'; // Low - red
    return '#BDC3C7'; // None - gray
  };

  const getProgressWidth = (completed: number, goal: number) => {
    return Math.max((completed / goal) * 100, 5); // Minimum 5% width for visibility
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <View style={{ 
        paddingTop: insets.top, 
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        borderBottomWidth: 1, 
        borderBottomColor: '#E5E7EB' 
      }}>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          paddingHorizontal: 24, 
          paddingVertical: 20 
        }}>
          {navigation && (
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.goBack();
              }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.6 : 1,
                marginRight: 16,
                padding: 8,
                marginLeft: -8,
              })}
            >
              <Ionicons name="chevron-back" size={24} color="#16A085" />
            </Pressable>
          )}
          
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text 
              style={{
                color: '#2C3E50',
                fontSize: 28,
                lineHeight: 34,
                letterSpacing: -0.3,
                fontWeight: '600'
              }}
            >
              Greens History
            </Text>
            <Text 
              style={{
                color: '#7F8C8D',
                fontSize: 15,
                lineHeight: 22,
                marginTop: 8
              }}
            >
              Your weekly progress tracking
            </Text>
          </View>
          
          {/* Spacer to balance the back button */}
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
        {/* Weekly Overview */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <Text style={{
            color: '#2C3E50',
            fontSize: 20,
            lineHeight: 26,
            fontWeight: '600',
            marginBottom: 16,
          }}>
            This Week
          </Text>

          {/* Weekly Progress Bars */}
          <View style={{ gap: 16 }}>
            {weeklyData.map((dayData, index) => {
              const progressPercentage = (dayData.completed / dayData.goal) * 100;
              const progressColor = getProgressColor(dayData.completed, dayData.goal);
              const progressWidth = getProgressWidth(dayData.completed, dayData.goal);
              
              return (
                <View key={dayData.date} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {/* Day Label */}
                  <View style={{ width: 80 }}>
                    <Text style={{
                      color: '#2C3E50',
                      fontSize: 16,
                      lineHeight: 20,
                      fontWeight: '500',
                    }}>
                      {getDayName(dayData.date)}
                    </Text>
                    <Text style={{
                      color: '#7F8C8D',
                      fontSize: 12,
                      lineHeight: 16,
                      marginTop: 2,
                    }}>
                      {new Date(dayData.date + 'T00:00:00').toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </Text>
                  </View>

                  {/* Progress Bar Container */}
                  <View style={{ flex: 1, marginHorizontal: 16 }}>
                    <View style={{
                      height: 8,
                      backgroundColor: '#E9ECEF',
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}>
                      {/* Progress Bar Fill */}
                      <View style={{
                        height: '100%',
                        width: `${progressWidth}%`,
                        backgroundColor: progressColor,
                        borderRadius: 4,
                      }} />
                    </View>
                  </View>

                  {/* Progress Text */}
                  <View style={{ width: 60, alignItems: 'flex-end' }}>
                    <Text style={{
                      color: progressColor,
                      fontSize: 16,
                      lineHeight: 20,
                      fontWeight: '600',
                    }}>
                      {dayData.completed}/{dayData.goal}
                    </Text>
                    <Text style={{
                      color: '#7F8C8D',
                      fontSize: 12,
                      lineHeight: 16,
                      marginTop: 2,
                    }}>
                      {Math.round(progressPercentage)}%
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Weekly Stats */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <Text style={{
            color: '#2C3E50',
            fontSize: 20,
            lineHeight: 26,
            fontWeight: '600',
            marginBottom: 16,
          }}>
            Weekly Summary
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {/* Total Servings */}
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{
                color: '#16A085',
                fontSize: 32,
                lineHeight: 38,
                fontWeight: '300',
                letterSpacing: -0.5,
              }}>
                {weeklyData.reduce((sum, day) => sum + day.completed, 0)}
              </Text>
              <Text style={{
                color: '#7F8C8D',
                fontSize: 14,
                lineHeight: 18,
                fontWeight: '500',
                marginTop: 4,
                textAlign: 'center',
              }}>
                Total Servings
              </Text>
            </View>

            {/* Average Per Day */}
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{
                color: '#3498DB',
                fontSize: 32,
                lineHeight: 38,
                fontWeight: '300',
                letterSpacing: -0.5,
              }}>
                {(weeklyData.reduce((sum, day) => sum + day.completed, 0) / 7).toFixed(1)}
              </Text>
              <Text style={{
                color: '#7F8C8D',
                fontSize: 14,
                lineHeight: 18,
                fontWeight: '500',
                marginTop: 4,
                textAlign: 'center',
              }}>
                Daily Average
              </Text>
            </View>

            {/* Perfect Days */}
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{
                color: '#2ECC71',
                fontSize: 32,
                lineHeight: 38,
                fontWeight: '300',
                letterSpacing: -0.5,
              }}>
                {weeklyData.filter(day => day.completed >= day.goal).length}
              </Text>
              <Text style={{
                color: '#7F8C8D',
                fontSize: 14,
                lineHeight: 18,
                fontWeight: '500',
                marginTop: 4,
                textAlign: 'center',
              }}>
                Perfect Days
              </Text>
            </View>
          </View>
        </View>

        {/* Motivational Message */}
        <View style={{
          backgroundColor: '#16A085',
          borderRadius: 16,
          padding: 24,
          alignItems: 'center',
        }}>
          <Text style={{
            color: 'white',
            fontSize: 18,
            lineHeight: 24,
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: 8,
          }}>
            Keep Going! 🌱
          </Text>
          <Text style={{
            color: 'white',
            fontSize: 15,
            lineHeight: 22,
            textAlign: 'center',
            opacity: 0.9,
          }}>
            Every serving of greens is a step toward better heart health and vitality.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}