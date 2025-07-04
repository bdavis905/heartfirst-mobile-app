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
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ paddingTop: insets.top, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
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
                fontWeight: '600',
                textAlign: 'center'
              }}
            >
              Food Analyzer
            </Text>
            <Text 
              style={{
                color: '#7F8C8D',
                fontSize: 15,
                lineHeight: 22,
                marginTop: 8,
                textAlign: 'center'
              }}
            >
              Choose what you'd like to scan
            </Text>
          </View>
          
          {/* Spacer to balance the back button */}
          <View style={{ width: 40 }} />
        </View>
          
        {/* Subscription Status */}
        <View style={{ marginTop: 16, alignItems: 'center' }}>
          {isSubscribed ? (
            <View style={{ backgroundColor: '#E8F8F5', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 }}>
              <Text style={{ color: '#16A085', fontWeight: '500', fontSize: 12 }}>
                Premium • {remainingScans} scans left this month
              </Text>
            </View>
          ) : subscriptionStatus === 'expired' ? (
            <View style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 }}>
              <Text style={{ color: '#E74C3C', fontWeight: '500', fontSize: 12 }}>
                Free trial expired • Upgrade to continue
              </Text>
            </View>
          ) : (
            <View style={{ backgroundColor: 'rgba(52, 152, 219, 0.1)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 }}>
              <Text style={{ color: '#3498DB', fontWeight: '500', fontSize: 12 }}>
                Free trial • {remainingScans} scans remaining
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 32, justifyContent: 'center' }}>
        <View style={{ gap: 24 }}>
          {/* Barcode Scanner */}
          <Pressable
            onPress={() => handleScanTypeSelect('barcode')}
            style={({ pressed }) => ({
              backgroundColor: '#FF6B6B',
              shadowColor: '#FF6B6B',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
              borderRadius: 24,
              padding: 32,
              transform: [{ scale: pressed ? 0.95 : 1 }]
            })}
          >
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="barcode-outline" size={64} color="white" />
              <Text style={{ color: 'white', fontWeight: '700', fontSize: 20, lineHeight: 26, marginTop: 16 }}>
                Scan Barcode
              </Text>
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center', marginTop: 8, fontSize: 14, lineHeight: 18 }}>
                Quick compliance check for packaged foods
              </Text>
            </View>
          </Pressable>

          {/* Food Label Scanner */}
          <Pressable
            onPress={() => handleScanTypeSelect('food_label')}
            style={({ pressed }) => ({
              backgroundColor: '#3498DB',
              shadowColor: '#3498DB',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
              borderRadius: 24,
              padding: 32,
              transform: [{ scale: pressed ? 0.95 : 1 }]
            })}
          >
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="nutrition-outline" size={64} color="white" />
              <Text style={{ color: 'white', fontWeight: '700', fontSize: 20, lineHeight: 26, marginTop: 16 }}>
                Scan Food Label
              </Text>
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center', marginTop: 8, fontSize: 14, lineHeight: 18 }}>
                Analyze ingredients and nutrition information
              </Text>
            </View>
          </Pressable>

          {/* Restaurant Menu Scanner */}
          <Pressable
            onPress={() => handleScanTypeSelect('restaurant_menu')}
            style={({ pressed }) => ({
              backgroundColor: '#16A085',
              shadowColor: '#16A085',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
              borderRadius: 24,
              padding: 32,
              transform: [{ scale: pressed ? 0.95 : 1 }]
            })}
          >
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="restaurant-outline" size={64} color="white" />
              <Text style={{ color: 'white', fontWeight: '700', fontSize: 20, lineHeight: 26, marginTop: 16 }}>
                Scan Restaurant Menu
              </Text>
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center', marginTop: 8, fontSize: 14, lineHeight: 18 }}>
                Get recommendations and modification suggestions
              </Text>
            </View>
          </Pressable>
        </View>

        <View style={{ marginTop: 48, paddingHorizontal: 16 }}>
          <Text style={{ color: '#7F8C8D', textAlign: 'center', fontSize: 12, lineHeight: 16 }}>
            All scans are analyzed against Dr. Esselstyn's heart disease reversal protocol
          </Text>
        </View>
      </View>
    </View>
  );
}