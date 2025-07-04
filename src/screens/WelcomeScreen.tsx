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
  navigation?: {
    goBack: () => void;
  };
}

export default function WelcomeScreen({ onScanTypeSelect, navigation }: WelcomeScreenProps) {
  const insets = useSafeAreaInsets();
  const { isSubscribed, getRemainingScans, getSubscriptionStatus } = useSubscriptionStore();

  const handleScanTypeSelect = async (type: ScanType) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onScanTypeSelect(type);
  };

  const remainingScans = getRemainingScans();
  const subscriptionStatus = getSubscriptionStatus();

  return (
    <View className="flex-1 bg-white">
        <View style={{ paddingTop: insets.top }} className="bg-white/90 border-b border-gray-200">
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
                className="font-semibold text-center"
                style={{
                  color: '#2C3E50',
                  fontSize: 28,
                  lineHeight: 34,
                  letterSpacing: -0.3
                }}
              >
                Food Analyzer
              </Text>
              <Text 
                className="text-center"
                style={{
                  color: '#7F8C8D',
                  fontSize: 15,
                  lineHeight: 22,
                  marginTop: 8
                }}
              >
                Choose what you'd like to scan
              </Text>
            </View>
            
            {/* Spacer to balance the back button */}
            <View style={{ width: 40 }} />
          </View>
            
            {/* Subscription Status */}
            <View style={{ marginTop: 16 }} className="items-center">
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
              className="rounded-3xl p-8 shadow-lg active:scale-95"
              style={{
                backgroundColor: '#FF6B6B',
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
              className="rounded-3xl p-8 shadow-lg active:scale-95"
              style={{
                backgroundColor: '#3498DB',
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
              className="rounded-3xl p-8 shadow-lg active:scale-95"
              style={{
                backgroundColor: '#16A085',
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