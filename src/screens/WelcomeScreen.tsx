import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSubscriptionStore } from '../state/subscriptionStore';
import FloatingChatButton from '../components/FloatingChatButton';
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
      {/* Floating Chat Button */}
      <FloatingChatButton />
      
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

      <View style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 20 }}>

        <View style={{ flexDirection: 'column', paddingTop: 20 }}>
          {/* Barcode Scanner */}
          <Pressable
            onPress={() => handleScanTypeSelect('barcode')}
            style={{
              backgroundColor: '#FF6B6B',
              borderRadius: 20,
              padding: 24,
              marginBottom: 16,
              minHeight: 120,
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="barcode-outline" size={48} color="white" />
              <Text style={{
                color: 'white',
                fontWeight: '700',
                fontSize: 18,
                lineHeight: 22,
                marginTop: 12,
                textAlign: 'center'
              }}>
                Scan Barcode
              </Text>
              <Text style={{
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
                marginTop: 6,
                fontSize: 12,
                lineHeight: 16
              }}>
                Quick compliance check for packaged foods
              </Text>
            </View>
          </Pressable>

          {/* Food Label Scanner */}
          <Pressable
            onPress={() => handleScanTypeSelect('food_label')}
            style={{
              backgroundColor: '#3498DB',
              borderRadius: 20,
              padding: 24,
              marginBottom: 16,
              minHeight: 120,
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="nutrition-outline" size={48} color="white" />
              <Text style={{
                color: 'white',
                fontWeight: '700',
                fontSize: 18,
                lineHeight: 22,
                marginTop: 12,
                textAlign: 'center'
              }}>
                Scan Food Label
              </Text>
              <Text style={{
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
                marginTop: 6,
                fontSize: 12,
                lineHeight: 16
              }}>
                Analyze ingredients and nutrition information
              </Text>
            </View>
          </Pressable>

          {/* Restaurant Menu Scanner */}
          <Pressable
            onPress={() => handleScanTypeSelect('restaurant_menu')}
            style={{
              backgroundColor: '#16A085',
              borderRadius: 20,
              padding: 24,
              marginBottom: 16,
              minHeight: 120,
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="restaurant-outline" size={48} color="white" />
              <Text style={{
                color: 'white',
                fontWeight: '700',
                fontSize: 18,
                lineHeight: 22,
                marginTop: 12,
                textAlign: 'center'
              }}>
                Scan Restaurant Menu
              </Text>
              <Text style={{
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
                marginTop: 6,
                fontSize: 12,
                lineHeight: 16
              }}>
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