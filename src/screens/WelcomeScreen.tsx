import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSubscriptionStore } from '../state/subscriptionStore';
// import { LinearGradient } from 'expo-linear-gradient';

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
    <View className="flex-1" style={{ backgroundColor: '#FFFFFF' }}>
        <View style={{ paddingTop: insets.top }} className="bg-background-primary/90 border-b border-background-tertiary">
          <View className="px-24dp py-20dp">
            <Text className="text-h2 font-semibold text-text-primary text-center">
              Food Analyzer
            </Text>
            <Text className="text-body-regular text-text-secondary text-center mt-8dp">
              Choose what you'd like to scan
            </Text>
            
            {/* Subscription Status */}
            <View className="mt-16dp items-center">
              {isSubscribed ? (
                <View className="bg-secondary-green-pale rounded-full px-16dp py-8dp">
                  <Text className="text-success font-medium text-caption">
                    Premium • {remainingScans} scans left this month
                  </Text>
                </View>
              ) : subscriptionStatus === 'expired' ? (
                <View className="bg-error/10 rounded-full px-16dp py-8dp">
                  <Text className="text-error font-medium text-caption">
                    Free trial expired • Upgrade to continue
                  </Text>
                </View>
              ) : (
                <View className="bg-info/10 rounded-full px-16dp py-8dp">
                  <Text className="text-info font-medium text-caption">
                    Free trial • {remainingScans} scans remaining
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View className="flex-1 px-24dp py-32dp justify-center">
          <View className="space-y-6">
            {/* Barcode Scanner */}
            <Pressable
              onPress={() => handleScanTypeSelect('barcode')}
              className="bg-accent-coral rounded-28dp p-32dp shadow-lg active:scale-95"
              style={{
                shadowColor: '#FF6B6B',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <View className="items-center">
                <Ionicons name="barcode-outline" size={64} color="white" />
                <Text className="text-primary-white font-bold text-h3 mt-16dp">
                  Scan Barcode
                </Text>
                <Text className="text-primary-white/80 text-center mt-8dp text-body-regular">
                  Quick compliance check for packaged foods
                </Text>
              </View>
            </Pressable>

            {/* Food Label Scanner */}
            <Pressable
              onPress={() => handleScanTypeSelect('food_label')}
              className="bg-info rounded-28dp p-32dp shadow-lg active:scale-95"
              style={{
                shadowColor: '#3498DB',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <View className="items-center">
                <Ionicons name="nutrition-outline" size={64} color="white" />
                <Text className="text-primary-white font-bold text-h3 mt-16dp">
                  Scan Food Label
                </Text>
                <Text className="text-primary-white/80 text-center mt-8dp text-body-regular">
                  Analyze ingredients and nutrition information
                </Text>
              </View>
            </Pressable>

            {/* Restaurant Menu Scanner */}
            <Pressable
              onPress={() => handleScanTypeSelect('restaurant_menu')}
              className="bg-primary-green rounded-28dp p-32dp shadow-lg active:scale-95"
              style={{
                shadowColor: '#16A085',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <View className="items-center">
                <Ionicons name="restaurant-outline" size={64} color="white" />
                <Text className="text-primary-white font-bold text-h3 mt-16dp">
                  Scan Restaurant Menu
                </Text>
                <Text className="text-primary-white/80 text-center mt-8dp text-body-regular">
                  Get recommendations and modification suggestions
                </Text>
              </View>
            </Pressable>
          </View>

          <View className="mt-48dp px-16dp">
            <Text className="text-text-tertiary text-center text-body-small">
              All scans are analyzed against Dr. Esselstyn's heart disease reversal protocol
            </Text>
          </View>
        </View>
    </View>
  );
}