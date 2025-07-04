import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useGreensTrackerStore } from '../state/greensTrackerStore';
import GreensRingProgress from '../components/GreensRingProgress';

export default function GreensTrackerScreen() {
  const insets = useSafeAreaInsets();
  const {
    servings,
    dailyGoal,
    initializeDay,
    addServing,
    toggleServing,
    getProgressPercentage,
    getCompletedServings,
  } = useGreensTrackerStore();

  useEffect(() => {
    // Initialize today's data
    const today = new Date().toISOString().split('T')[0];
    initializeDay(today);
  }, []);

  const handleAddServing = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addServing();
  };

  const handleToggleServing = async (servingId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleServing(servingId);
  };

  const progress = getProgressPercentage();
  const completed = getCompletedServings();

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#FFFFFF', '#E8F6F3']}
        locations={[0, 1]}
        className="flex-1"
      >
        {/* Header */}
        <View style={{ paddingTop: insets.top }} className="bg-white/90 border-b border-gray-200">
          <View style={{ paddingHorizontal: 24, paddingVertical: 20 }}>
            <Text
              className="font-bold text-center"
              style={{
                color: '#2C3E50',
                fontSize: 28,
                lineHeight: 34,
                letterSpacing: -0.3,
              }}
            >
              Daily Greens Tracker
            </Text>
            <Text
              className="text-center mt-2"
              style={{
                color: '#7F8C8D',
                fontSize: 15,
                lineHeight: 22,
              }}
            >
              Track your 6 daily servings
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 py-6">
          {/* Progress Ring */}
          <View className="items-center mb-8">
            <GreensRingProgress
              progress={progress}
              completed={completed}
              goal={dailyGoal}
              size={220}
              strokeWidth={18}
            />
          </View>

          {/* Quick Add Button */}
          <View className="mb-8">
            <Pressable
              onPress={handleAddServing}
              disabled={completed >= dailyGoal}
              className={`rounded-full h-14 items-center justify-center ${
                completed >= dailyGoal ? 'opacity-50' : ''
              }`}
              style={{
                backgroundColor: completed >= dailyGoal ? '#95A5A6' : '#16A085',
                shadowColor: '#16A085',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: completed >= dailyGoal ? 0 : 0.15,
                shadowRadius: 12,
                elevation: completed >= dailyGoal ? 0 : 8,
              }}
            >
              <View className="flex-row items-center">
                <Ionicons name="add" size={24} color="white" />
                <Text
                  className="font-semibold ml-2"
                  style={{
                    color: '#FFFFFF',
                    fontSize: 17,
                    lineHeight: 24,
                    letterSpacing: 0.1,
                  }}
                >
                  {completed >= dailyGoal ? 'Goal Complete!' : 'Add Serving'}
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Daily Schedule */}
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <View className="p-5 border-b border-gray-100">
              <Text
                className="font-semibold"
                style={{
                  color: '#2C3E50',
                  fontSize: 18,
                  lineHeight: 24,
                  letterSpacing: -0.1,
                }}
              >
                Today's Schedule
              </Text>
              <Text
                style={{
                  color: '#7F8C8D',
                  fontSize: 13,
                  lineHeight: 18,
                  letterSpacing: 0.1,
                }}
              >
                Evenly spaced from morning to bedtime
              </Text>
            </View>

            <View className="p-5">
              {servings.map((serving, index) => (
                <Pressable
                  key={serving.id}
                  onPress={() => handleToggleServing(serving.id)}
                  className={`flex-row items-center p-4 rounded-xl mb-3 last:mb-0 ${
                    serving.completed ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  <View
                    className={`w-8 h-8 rounded-full items-center justify-center mr-4 ${
                      serving.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    {serving.completed ? (
                      <Ionicons name="checkmark" size={18} color="white" />
                    ) : (
                      <Text
                        className="font-semibold"
                        style={{
                          color: 'white',
                          fontSize: 12,
                        }}
                      >
                        {index + 1}
                      </Text>
                    )}
                  </View>

                  <View className="flex-1">
                    <Text
                      className="font-medium"
                      style={{
                        color: serving.completed ? '#2ECC71' : '#2C3E50',
                        fontSize: 16,
                        lineHeight: 20,
                      }}
                    >
                      Serving {index + 1}
                    </Text>
                    <Text
                      style={{
                        color: serving.completed ? '#27AE60' : '#7F8C8D',
                        fontSize: 14,
                        lineHeight: 18,
                      }}
                    >
                      {serving.time}
                    </Text>
                  </View>

                  <View className="items-end">
                    {serving.completed ? (
                      <View className="items-center">
                        <Ionicons name="leaf" size={20} color="#2ECC71" />
                        <Text
                          style={{
                            color: '#27AE60',
                            fontSize: 10,
                            marginTop: 2,
                          }}
                        >
                          Done
                        </Text>
                      </View>
                    ) : (
                      <Ionicons name="chevron-forward" size={16} color="#95A5A6" />
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Tips */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <View className="flex-row items-center mb-4">
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: '#3498DB15' }}
              >
                <Ionicons name="bulb" size={20} color="#3498DB" />
              </View>
              <Text
                className="font-semibold"
                style={{
                  color: '#2C3E50',
                  fontSize: 16,
                  lineHeight: 20,
                }}
              >
                Daily Tips
              </Text>
            </View>

            <View className="space-y-3">
              <View className="flex-row items-start">
                <View className="w-2 h-2 rounded-full mt-2 mr-3" style={{ backgroundColor: '#16A085' }} />
                <Text
                  style={{
                    color: '#7F8C8D',
                    fontSize: 14,
                    lineHeight: 20,
                    flex: 1,
                  }}
                >
                  Start your day with greens to boost energy and metabolism
                </Text>
              </View>
              <View className="flex-row items-start">
                <View className="w-2 h-2 rounded-full mt-2 mr-3" style={{ backgroundColor: '#16A085' }} />
                <Text
                  style={{
                    color: '#7F8C8D',
                    fontSize: 14,
                    lineHeight: 20,
                    flex: 1,
                  }}
                >
                  Mix different types: kale, spinach, arugula, lettuce varieties
                </Text>
              </View>
              <View className="flex-row items-start">
                <View className="w-2 h-2 rounded-full mt-2 mr-3" style={{ backgroundColor: '#16A085' }} />
                <Text
                  style={{
                    color: '#7F8C8D',
                    fontSize: 14,
                    lineHeight: 20,
                    flex: 1,
                  }}
                >
                  End with greens before bed to support overnight healing
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}