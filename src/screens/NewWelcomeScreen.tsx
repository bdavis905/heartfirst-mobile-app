import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface NewWelcomeScreenProps {
  onGetStarted: () => void;
}

export default function NewWelcomeScreen({ onGetStarted }: NewWelcomeScreenProps) {
  const insets = useSafeAreaInsets();
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    // Pulse animation for heart
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
        <View style={{ paddingTop: insets.top }} className="flex-1 px-6 justify-center">
        <Animated.View 
          className="items-center mb-8"
          style={{ opacity: fadeAnimation }}
        >
          <Animated.View 
            className="w-20 h-20 rounded-full items-center justify-center mb-6"
            style={{ 
              backgroundColor: '#16A085',
              transform: [{ scale: pulseAnimation }]
            }}
          >
            <Ionicons name="heart" size={40} color="white" />
          </Animated.View>
          
          <Text 
            className="text-3xl font-bold text-center mb-4"
            style={{ 
              color: '#2C3E50',
              fontSize: 34,
              lineHeight: 40,
              letterSpacing: -0.4 
            }}
          >
            Begin Your Healing Journey
          </Text>
          
          <Text 
            className="text-base text-center mb-8 px-4"
            style={{ 
              color: '#7F8C8D',
              fontSize: 17,
              lineHeight: 26 
            }}
          >
            Transform your relationship with food using Dr. Esselstyn's proven heart disease reversal protocol
          </Text>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnimation }}>
          <Pressable
            onPress={handleGetStarted}
          className="rounded-full items-center justify-center"
          style={{
            backgroundColor: '#16A085',
            height: 56,
            shadowColor: '#16A085',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <Text 
            className="font-semibold"
            style={{
              color: '#FFFFFF',
              fontSize: 17,
              lineHeight: 24,
              letterSpacing: 0.1
            }}
          >
            Let's Get Started
          </Text>
        </Pressable>

        <Text 
          className="text-center mt-4"
          style={{
            color: '#95A5A6',
            fontSize: 12,
            lineHeight: 16,
            letterSpacing: 0.2
          }}
        >
          5 free scans to try • No commitment required
        </Text>
        </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
}