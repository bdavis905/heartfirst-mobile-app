import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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
    <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <View style={{ 
        paddingTop: insets.top, 
        backgroundColor: 'white', 
        borderBottomWidth: 1, 
        borderBottomColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
      }}>
        <View style={{ paddingHorizontal: 24, paddingVertical: 20 }}>
          <Text
            style={{
              color: '#2C3E50',
              fontSize: 28,
              lineHeight: 34,
              letterSpacing: -0.3,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            Daily Greens Tracker
          </Text>
          <Text
            style={{
              color: '#7F8C8D',
              fontSize: 15,
              lineHeight: 22,
              textAlign: 'center',
              marginTop: 8,
            }}
          >
            Track your 6 daily servings
          </Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 24 }}>
        {/* Progress Ring */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <GreensRingProgress
            progress={progress}
            completed={completed}
            goal={dailyGoal}
            size={220}
            strokeWidth={18}
          />
        </View>

        {/* Quick Add Button */}
        <View style={{ marginBottom: 32 }}>
          <Pressable
            onPress={handleAddServing}
            disabled={completed >= dailyGoal}
            style={{
              height: 56,
              borderRadius: 28,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: completed >= dailyGoal ? '#95A5A6' : '#16A085',
              shadowColor: '#16A085',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: completed >= dailyGoal ? 0 : 0.15,
              shadowRadius: 12,
              elevation: completed >= dailyGoal ? 0 : 8,
              opacity: completed >= dailyGoal ? 0.7 : 1,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="add" size={24} color="white" />
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 17,
                  lineHeight: 24,
                  letterSpacing: 0.1,
                  fontWeight: '600',
                  marginLeft: 8,
                }}
              >
                {completed >= dailyGoal ? 'Goal Complete!' : 'Add Serving'}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Daily Schedule */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
          overflow: 'hidden',
          marginBottom: 24,
        }}>
          <View style={{ 
            padding: 20, 
            borderBottomWidth: 1, 
            borderBottomColor: '#F3F4F6' 
          }}>
            <Text
              style={{
                color: '#2C3E50',
                fontSize: 18,
                lineHeight: 24,
                letterSpacing: -0.1,
                fontWeight: '600',
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

          <View style={{ padding: 20 }}>
            {servings.map((serving, index) => (
              <Pressable
                key={serving.id}
                onPress={() => handleToggleServing(serving.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: index === servings.length - 1 ? 0 : 12,
                  backgroundColor: serving.completed ? '#F0FDF4' : '#F9FAFB',
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 16,
                    backgroundColor: serving.completed ? '#22C55E' : '#9CA3AF',
                  }}
                >
                  {serving.completed ? (
                    <Ionicons name="checkmark" size={18} color="white" />
                  ) : (
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 12,
                        fontWeight: '600',
                      }}
                    >
                      {index + 1}
                    </Text>
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: serving.completed ? '#16A34A' : '#2C3E50',
                      fontSize: 16,
                      lineHeight: 20,
                      fontWeight: '500',
                    }}
                  >
                    Serving {index + 1}
                  </Text>
                  <Text
                    style={{
                      color: serving.completed ? '#15803D' : '#7F8C8D',
                      fontSize: 14,
                      lineHeight: 18,
                    }}
                  >
                    {serving.time}
                  </Text>
                </View>

                <View style={{ alignItems: 'center' }}>
                  {serving.completed ? (
                    <View style={{ alignItems: 'center' }}>
                      <Ionicons name="leaf" size={20} color="#16A34A" />
                      <Text
                        style={{
                          color: '#15803D',
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
        <View style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
          marginBottom: 24,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
                backgroundColor: '#3498DB15',
              }}
            >
              <Ionicons name="bulb" size={20} color="#3498DB" />
            </View>
            <Text
              style={{
                color: '#2C3E50',
                fontSize: 16,
                lineHeight: 20,
                fontWeight: '600',
              }}
            >
              Daily Tips
            </Text>
          </View>

          <View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
              <View style={{ 
                width: 8, 
                height: 8, 
                borderRadius: 4, 
                marginTop: 8, 
                marginRight: 12, 
                backgroundColor: '#16A085' 
              }} />
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
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
              <View style={{ 
                width: 8, 
                height: 8, 
                borderRadius: 4, 
                marginTop: 8, 
                marginRight: 12, 
                backgroundColor: '#16A085' 
              }} />
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
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <View style={{ 
                width: 8, 
                height: 8, 
                borderRadius: 4, 
                marginTop: 8, 
                marginRight: 12, 
                backgroundColor: '#16A085' 
              }} />
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
    </View>
  );
}