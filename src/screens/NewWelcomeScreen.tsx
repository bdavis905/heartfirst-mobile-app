import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

interface NewWelcomeScreenProps {
  onGetStarted: () => void;
}

export default function NewWelcomeScreen({ onGetStarted }: NewWelcomeScreenProps) {
  const insets = useSafeAreaInsets();
  const pulseAnimation = useRef(new Animated.Value(0.8)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Start animations on mount
    Animated.sequence([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for the heart icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 0.8,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleGetStarted = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onGetStarted();
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#FFFFFF', '#E8F6F3']}
        locations={[0, 1]}
        className="flex-1"
      >
        <View style={{ paddingTop: insets.top }} className="flex-1">
          {/* Header with Logo */}
          <View className="items-center pt-16 pb-8">
            <Animated.View
              style={{
                opacity: fadeAnimation,
                transform: [
                  {
                    translateY: slideAnimation,
                  },
                ],
              }}
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      scale: pulseAnimation,
                    },
                  ],
                }}
                className="w-20 h-20 bg-primary-green rounded-full items-center justify-center mb-6"
              >
                <Ionicons name="heart" size={40} color="#FFFFFF" />
              </Animated.View>
              
              <Text className="text-h1 font-bold text-text-primary text-center mb-2">
                Begin Your Healing Journey
              </Text>
              
              <Text className="text-body-large text-text-secondary text-center px-8">
                Transform your relationship with food using Dr. Esselstyn's proven heart disease reversal protocol
              </Text>
            </Animated.View>
          </View>

          {/* Feature Cards */}
          <View className="flex-1 justify-center px-6">
            <Animated.View
              style={{
                opacity: fadeAnimation,
                transform: [
                  {
                    translateY: slideAnimation,
                  },
                ],
              }}
            >
              <View className="space-y-4">
                <View className="bg-background-primary rounded-16dp p-20dp shadow-sm border border-transparent">
                  <View className="flex-row items-center mb-3">
                    <View className="w-10 h-10 bg-secondary-green-pale rounded-full items-center justify-center mr-4">
                      <Ionicons name="camera-outline" size={20} color="#16A085" />
                    </View>
                    <Text className="text-h4 font-medium text-text-primary">
                      Smart Food Analysis
                    </Text>
                  </View>
                  <Text className="text-body-regular text-text-secondary">
                    Instantly analyze food labels, barcodes, and restaurant menus for protocol compliance
                  </Text>
                </View>

                <View className="bg-background-primary rounded-16dp p-20dp shadow-sm border border-transparent">
                  <View className="flex-row items-center mb-3">
                    <View className="w-10 h-10 bg-secondary-green-pale rounded-full items-center justify-center mr-4">
                      <Ionicons name="restaurant-outline" size={20} color="#16A085" />
                    </View>
                    <Text className="text-h4 font-medium text-text-primary">
                      Dining Made Simple
                    </Text>
                  </View>
                  <Text className="text-body-regular text-text-secondary">
                    Get personalized recommendations and server scripts for any restaurant
                  </Text>
                </View>

                <View className="bg-background-primary rounded-16dp p-20dp shadow-sm border border-transparent">
                  <View className="flex-row items-center mb-3">
                    <View className="w-10 h-10 bg-secondary-green-pale rounded-full items-center justify-center mr-4">
                      <Ionicons name="heart-outline" size={20} color="#16A085" />
                    </View>
                    <Text className="text-h4 font-medium text-text-primary">
                      Heart-First Approach
                    </Text>
                  </View>
                  <Text className="text-body-regular text-text-secondary">
                    Every recommendation is based on proven science for cardiovascular health
                  </Text>
                </View>
              </View>
            </Animated.View>
          </View>

          {/* Bottom Action */}
          <View className="px-6 pb-12">
            <Animated.View
              style={{
                opacity: fadeAnimation,
                transform: [
                  {
                    translateY: slideAnimation,
                  },
                ],
              }}
            >
              <Pressable
                onPress={handleGetStarted}
                className="bg-primary-green rounded-28dp h-56dp items-center justify-center shadow-lg active:scale-95"
                style={{
                  shadowColor: '#16A085',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <Text className="text-button font-semibold text-primary-white">
                  Let's Get Started
                </Text>
              </Pressable>

              <Text className="text-caption font-medium text-text-tertiary text-center mt-4">
                5 free scans to try • No commitment required
              </Text>
            </Animated.View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}