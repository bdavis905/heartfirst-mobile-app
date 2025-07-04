import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSubscriptionStore } from '../state/subscriptionStore';

interface SubscriptionScreenProps {
  onBack: () => void;
  onSubscribe: () => void;
}

export default function SubscriptionScreen({ onBack, onSubscribe }: SubscriptionScreenProps) {
  const insets = useSafeAreaInsets();
  const { freeScansUsed, maxFreeScans, subscribe, unsubscribe } = useSubscriptionStore();

  const handleSubscribe = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // In a real app, this would trigger the actual subscription flow
    // For now, we'll just mark as subscribed
    subscribe();
    onSubscribe();
  };

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onBack();
  };

  // For testing purposes - reset subscription state
  const handleReset = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    unsubscribe();
    // Reset to initial state by updating the store
    useSubscriptionStore.setState({ freeScansUsed: 0, monthlyScansUsed: 0 });
    onBack();
  };

  return (
    <View className="flex-1 bg-slate-900">
      <View style={{ paddingTop: insets.top }} className="bg-white border-b border-gray-200">
        <View className="flex-row items-center justify-between px-6 py-4">
          <Pressable onPress={handleBack} className="flex-row items-center">
            <Ionicons name="arrow-back" size={24} color="#374151" />
            <Text className="text-gray-700 font-medium ml-2">Back</Text>
          </Pressable>
          <Text className="text-lg font-semibold text-gray-800">Upgrade to Premium</Text>
          <View className="w-16" />
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="camera" size={40} color="#3b82f6" />
          </View>
          <Text className="text-2xl font-bold text-white text-center mb-2">
            You've used all {maxFreeScans} free scans!
          </Text>
          <Text className="text-gray-300 text-center">
            Upgrade to Premium to continue analyzing food items and get unlimited access to Dr. Esselstyn's protocol guidance.
          </Text>
        </View>

        {/* Premium Features */}
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            Premium Features
          </Text>
          
          <View className="space-y-4">
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              <Text className="text-gray-700 ml-3 flex-1">
                50 scans per month
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              <Text className="text-gray-700 ml-3 flex-1">
                Unlimited barcode, food label, and menu scanning
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              <Text className="text-gray-700 ml-3 flex-1">
                Detailed restaurant menu recommendations
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              <Text className="text-gray-700 ml-3 flex-1">
                Priority support for heart-healthy eating
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              <Text className="text-gray-700 ml-3 flex-1">
                Monthly updates with new protocol insights
              </Text>
            </View>
          </View>
        </View>

        {/* Pricing */}
        <View className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200 mb-8">
          <View className="items-center">
            <Text className="text-3xl font-bold text-blue-600 mb-2">
              $18
            </Text>
            <Text className="text-blue-600 font-semibold mb-4">
              per month
            </Text>
            <Text className="text-gray-600 text-center text-sm">
              Cancel anytime. No commitments.
            </Text>
          </View>
        </View>

        {/* Subscribe Button */}
        <Pressable
          onPress={handleSubscribe}
          className="bg-blue-500 rounded-xl py-4 px-6 shadow-lg mb-4"
        >
          <Text className="text-white font-bold text-lg text-center">
            Start Premium Subscription
          </Text>
        </Pressable>

        {/* Fine Print */}
        <Text className="text-gray-400 text-center text-xs leading-relaxed mb-8">
          By subscribing, you agree to our Terms of Service and Privacy Policy. 
          Subscription will auto-renew monthly unless cancelled. 
          Cancel anytime in your device settings.
        </Text>

        {/* Reset Button (for testing) */}
        <Pressable
          onPress={handleReset}
          className="border border-gray-600 rounded-xl py-3 px-6 mb-4"
        >
          <Text className="text-gray-400 font-medium text-center text-sm">
            Reset App (Testing Only)
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}