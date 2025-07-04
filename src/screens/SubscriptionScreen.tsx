import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSubscriptionStore } from '../state/subscriptionStore';
import { LinearGradient } from 'expo-linear-gradient';

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
    <View className="flex-1">
      <LinearGradient
        colors={['#FFFFFF', '#E8F6F3']}
        locations={[0, 1]}
        className="flex-1"
      >
        <View style={{ paddingTop: insets.top }} className="bg-background-primary/90 border-b border-background-tertiary">
          <View className="flex-row items-center justify-between px-24dp py-20dp">
            <Pressable onPress={handleBack} className="flex-row items-center">
              <Ionicons name="arrow-back" size={24} color="#2C3E50" />
              <Text className="text-text-primary font-medium ml-8dp">Back</Text>
            </Pressable>
            <Text className="text-h4 font-semibold text-text-primary">Upgrade to Premium</Text>
            <View className="w-16" />
          </View>
        </View>

        <ScrollView className="flex-1 px-24dp py-32dp">
          {/* Header */}
          <View className="items-center mb-32dp">
            <View className="w-20 h-20 bg-secondary-green-pale rounded-full items-center justify-center mb-16dp">
              <Ionicons name="camera" size={40} color="#16A085" />
            </View>
            <Text className="text-h2 font-semibold text-text-primary text-center mb-8dp">
              You've used all {maxFreeScans} free scans!
            </Text>
            <Text className="text-body-large text-text-secondary text-center">
              Upgrade to Premium to continue analyzing food items and get unlimited access to Dr. Esselstyn's protocol guidance.
            </Text>
          </View>

          {/* Premium Features */}
          <View className="bg-background-primary rounded-16dp p-20dp shadow-sm mb-32dp">
            <Text className="text-h3 font-semibold text-text-primary mb-20dp">
              Premium Features
            </Text>
            
            <View className="space-y-4">
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={24} color="#2ECC71" />
                <Text className="text-text-primary ml-12dp flex-1 text-body-regular">
                  50 scans per month
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={24} color="#2ECC71" />
                <Text className="text-text-primary ml-12dp flex-1 text-body-regular">
                  Unlimited barcode, food label, and menu scanning
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={24} color="#2ECC71" />
                <Text className="text-text-primary ml-12dp flex-1 text-body-regular">
                  Detailed restaurant menu recommendations
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={24} color="#2ECC71" />
                <Text className="text-text-primary ml-12dp flex-1 text-body-regular">
                  Priority support for heart-healthy eating
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={24} color="#2ECC71" />
                <Text className="text-text-primary ml-12dp flex-1 text-body-regular">
                  Monthly updates with new protocol insights
                </Text>
              </View>
            </View>
          </View>

          {/* Pricing */}
          <View className="bg-secondary-green-pale rounded-16dp p-24dp border-2 border-secondary-green-light/20 mb-32dp">
            <View className="items-center">
              <Text className="text-data-display font-light text-primary-green mb-8dp">
                $18
              </Text>
              <Text className="text-primary-green font-semibold mb-16dp text-h4">
                per month
              </Text>
              <Text className="text-text-secondary text-center text-body-regular">
                Cancel anytime. No commitments.
              </Text>
            </View>
          </View>

          {/* Subscribe Button */}
          <Pressable
            onPress={handleSubscribe}
            className="bg-primary-green rounded-28dp h-56dp items-center justify-center shadow-lg mb-16dp"
            style={{
              shadowColor: '#16A085',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Text className="text-button font-semibold text-primary-white">
              Start Premium Subscription
            </Text>
          </Pressable>

          {/* Fine Print */}
          <Text className="text-text-tertiary text-center text-caption leading-relaxed mb-32dp">
            By subscribing, you agree to our Terms of Service and Privacy Policy. 
            Subscription will auto-renew monthly unless cancelled. 
            Cancel anytime in your device settings.
          </Text>

          {/* Reset Button (for testing) */}
          <Pressable
            onPress={handleReset}
            className="border border-background-tertiary rounded-12dp py-12dp px-24dp mb-16dp"
          >
            <Text className="text-text-tertiary font-medium text-center text-body-small">
              Reset App (Testing Only)
            </Text>
          </Pressable>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}