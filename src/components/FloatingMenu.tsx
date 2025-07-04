import React, { useState, useRef } from 'react';
import { View, Pressable, Animated, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MenuModal from './MenuModal';

interface FloatingMenuProps {
  onNavigate: (screen: 'guidelines' | 'greens_tracker' | 'scanner' | 'history') => void;
}

export default function FloatingMenu({ onNavigate }: FloatingMenuProps) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  const handleMenuPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Button animation
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsMenuVisible(true);
  };

  const handleMenuClose = () => {
    setIsMenuVisible(false);
  };

  const handleMenuSelect = async (option: 'guidelines' | 'greens_tracker' | 'scanner' | 'history') => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsMenuVisible(false);
    onNavigate(option);
  };

  return (
    <>
      {/* Floating Menu Button */}
      <Animated.View
        style={{
          position: 'absolute',
          top: insets.top + 20,
          right: 20,
          zIndex: 1000,
          transform: [{ scale: scaleAnimation }],
        }}
      >
        <Pressable
          onPress={handleMenuPress}
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{
            backgroundColor: '#16A085',
            shadowColor: '#16A085',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Ionicons name="menu" size={24} color="white" />
        </Pressable>
      </Animated.View>

      {/* Menu Modal */}
      <MenuModal
        visible={isMenuVisible}
        onClose={handleMenuClose}
        onSelect={handleMenuSelect}
      />
    </>
  );
}