import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Modal, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface MenuModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (option: 'guidelines' | 'greens_tracker' | 'scanner') => void;
}

export default function MenuModal({ visible, onClose, onSelect }: MenuModalProps) {
  const slideAnimation = useRef(new Animated.Value(-300)).current;
  const backdropAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropAnimation, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimation, {
          toValue: -300,
          duration: 250,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleOptionPress = async (option: 'guidelines' | 'greens_tracker' | 'scanner') => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(option);
  };

  const menuOptions = [
    {
      id: 'scanner' as const,
      title: 'Food Scanner',
      subtitle: 'Analyze food items',
      icon: 'camera-outline',
      color: '#16A085',
    },
    {
      id: 'greens_tracker' as const,
      title: 'Daily Greens',
      subtitle: 'Track your 6 servings',
      icon: 'leaf-outline',
      color: '#27AE60',
    },
    {
      id: 'guidelines' as const,
      title: 'Guidelines',
      subtitle: 'Dr. Esselstyn\'s protocol',
      icon: 'book-outline',
      color: '#3498DB',
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1">
        {/* Backdrop */}
        <Animated.View
          style={{
            opacity: backdropAnimation,
          }}
          className="absolute inset-0 bg-black/50"
        />
        
        <Pressable 
          className="flex-1" 
          onPress={onClose}
          style={{ backgroundColor: 'transparent' }}
        />

        {/* Menu Panel */}
        <Animated.View
          style={{
            transform: [{ translateX: slideAnimation }],
          }}
          className="absolute left-0 top-0 bottom-0 w-80"
        >
          <LinearGradient
            colors={['#FFFFFF', '#E8F6F3']}
            locations={[0, 1]}
            className="flex-1"
          >
            <View className="flex-1 pt-20 px-6">
              {/* Header */}
              <View className="mb-8">
                <View className="flex-row items-center justify-between mb-4">
                  <Text
                    className="font-bold"
                    style={{
                      color: '#2C3E50',
                      fontSize: 28,
                      lineHeight: 34,
                      letterSpacing: -0.3,
                    }}
                  >
                    Menu
                  </Text>
                  <Pressable onPress={onClose} className="w-8 h-8 items-center justify-center">
                    <Ionicons name="close" size={24} color="#7F8C8D" />
                  </Pressable>
                </View>
                <Text
                  style={{
                    color: '#7F8C8D',
                    fontSize: 15,
                    lineHeight: 22,
                  }}
                >
                  Navigate through your heart-healthy journey
                </Text>
              </View>

              {/* Menu Options */}
              <View className="space-y-4">
                {menuOptions.map((option, index) => (
                  <Pressable
                    key={option.id}
                    onPress={() => handleOptionPress(option.id)}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 active:scale-95"
                    style={{
                      shadowColor: option.color,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                  >
                    <View className="flex-row items-center">
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center mr-4"
                        style={{ backgroundColor: `${option.color}15` }}
                      >
                        <Ionicons name={option.icon as any} size={24} color={option.color} />
                      </View>
                      <View className="flex-1">
                        <Text
                          className="font-semibold mb-1"
                          style={{
                            color: '#2C3E50',
                            fontSize: 18,
                            lineHeight: 24,
                            letterSpacing: -0.1,
                          }}
                        >
                          {option.title}
                        </Text>
                        <Text
                          style={{
                            color: '#7F8C8D',
                            fontSize: 13,
                            lineHeight: 18,
                            letterSpacing: 0.1,
                          }}
                        >
                          {option.subtitle}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#95A5A6" />
                    </View>
                  </Pressable>
                ))}
              </View>

              {/* Footer */}
              <View className="mt-8 pt-6 border-t border-gray-200">
                <Text
                  className="text-center"
                  style={{
                    color: '#95A5A6',
                    fontSize: 12,
                    lineHeight: 16,
                    letterSpacing: 0.2,
                  }}
                >
                  Heart Disease Reversal Protocol
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}