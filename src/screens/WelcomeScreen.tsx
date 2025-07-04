import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSubscriptionStore } from '../state/subscriptionStore';

export type ScanType = 'barcode' | 'food_label' | 'restaurant_menu';

interface WelcomeScreenProps {
  onScanTypeSelect: (type: ScanType) => void;
}

export default function WelcomeScreen({ onScanTypeSelect }: WelcomeScreenProps) {
  const insets = useSafeAreaInsets();
  const { isSubscribed, getRemainingScans, getSubscriptionStatus } = useSubscriptionStore();

  const handleScanTypeSelect = async (type: ScanType) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onScanTypeSelect(type);
  };

  const remainingScans = getRemainingScans();
  const subscriptionStatus = getSubscriptionStatus();

  return (
    <View className="flex-1 bg-slate-50">
      <View style={{ paddingTop: insets.top }} className="bg-white border-b border-gray-200">
        <View className="px-6 py-4">
          <Text className="text-2xl font-bold text-gray-800 text-center">
            Food Analyzer
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            Choose what you'd like to scan
          </Text>
          
          {/* Subscription Status */}
          <View className="mt-4 items-center">
            {isSubscribed ? (
              <View className="bg-green-100 rounded-full px-4 py-2">
                <Text className="text-green-800 font-medium text-sm">
                  Premium • {remainingScans} scans left this month
                </Text>
              </View>
            ) : subscriptionStatus === 'expired' ? (
              <View className="bg-red-100 rounded-full px-4 py-2">
                <Text className="text-red-800 font-medium text-sm">
                  Free trial expired • Upgrade to continue
                </Text>
              </View>
            ) : (
              <View className="bg-blue-100 rounded-full px-4 py-2">
                <Text className="text-blue-800 font-medium text-sm">
                  Free trial • {remainingScans} scans remaining
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View className="flex-1 px-6 py-8 justify-center">
        <View className="space-y-6">
          {/* Barcode Scanner */}
          <Pressable
            onPress={() => handleScanTypeSelect('barcode')}
            className="bg-red-500 rounded-3xl p-8 shadow-lg active:scale-95"
            style={{ transform: [{ scale: 1 }] }}
          >
            <View className="items-center">
              <Ionicons name="barcode-outline" size={64} color="white" />
              <Text className="text-white font-bold text-2xl mt-4">
                Scan Barcode
              </Text>
              <Text className="text-red-100 text-center mt-2 text-base">
                Quick compliance check for packaged foods
              </Text>
            </View>
          </Pressable>

          {/* Food Label Scanner */}
          <Pressable
            onPress={() => handleScanTypeSelect('food_label')}
            className="bg-blue-500 rounded-3xl p-8 shadow-lg active:scale-95"
            style={{ transform: [{ scale: 1 }] }}
          >
            <View className="items-center">
              <Ionicons name="nutrition-outline" size={64} color="white" />
              <Text className="text-white font-bold text-2xl mt-4">
                Scan Food Label
              </Text>
              <Text className="text-blue-100 text-center mt-2 text-base">
                Analyze ingredients and nutrition information
              </Text>
            </View>
          </Pressable>

          {/* Restaurant Menu Scanner */}
          <Pressable
            onPress={() => handleScanTypeSelect('restaurant_menu')}
            className="bg-green-500 rounded-3xl p-8 shadow-lg active:scale-95"
            style={{ transform: [{ scale: 1 }] }}
          >
            <View className="items-center">
              <Ionicons name="restaurant-outline" size={64} color="white" />
              <Text className="text-white font-bold text-2xl mt-4">
                Scan Restaurant Menu
              </Text>
              <Text className="text-green-100 text-center mt-2 text-base">
                Get recommendations and modification suggestions
              </Text>
            </View>
          </Pressable>
        </View>

        <View className="mt-12 px-4">
          <Text className="text-gray-500 text-center text-sm">
            All scans are analyzed against Dr. Esselstyn's heart disease reversal protocol
          </Text>
        </View>
      </View>
    </View>
  );
}