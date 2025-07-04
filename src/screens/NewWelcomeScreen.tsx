import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface NewWelcomeScreenProps {
  onGetStarted: () => void;
}

export default function NewWelcomeScreen({ onGetStarted }: NewWelcomeScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <View style={{ paddingTop: insets.top }} className="flex-1 px-6 justify-center">
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-green-500 rounded-full items-center justify-center mb-6">
            <Ionicons name="heart" size={40} color="white" />
          </View>
          
          <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
            Begin Your Healing Journey
          </Text>
          
          <Text className="text-base text-gray-600 text-center mb-8">
            Transform your relationship with food using Dr. Esselstyn's proven heart disease reversal protocol
          </Text>
        </View>

        <Pressable
          onPress={onGetStarted}
          className="bg-green-500 rounded-full h-14 items-center justify-center"
        >
          <Text className="text-white font-semibold text-base">
            Let's Get Started
          </Text>
        </Pressable>

        <Text className="text-xs text-gray-400 text-center mt-4">
          5 free scans to try • No commitment required
        </Text>
      </View>
    </View>
  );
}