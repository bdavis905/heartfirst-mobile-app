import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Modal, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import * as Haptics from 'expo-haptics';

interface MenuModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (option: 'guidelines' | 'greens_tracker' | 'home' | 'history') => void;
}

export default function MenuModal({ visible, onClose, onSelect }: MenuModalProps) {
  const scaleAnimation = useRef(new Animated.Value(0)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacityAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnimation, {
          toValue: 1,
          damping: 15,
          mass: 1,
          stiffness: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacityAnimation, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimation, {
          toValue: -20,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleOptionPress = async (option: 'guidelines' | 'greens_tracker' | 'home' | 'history') => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(option);
  };

  const menuOptions = [
    {
      id: 'guidelines' as const,
      title: 'Guidelines',
      subtitle: 'Dr. Esselstyn\'s protocol',
      icon: 'book-outline',
      color: '#3498DB',
    },
    {
      id: 'home' as const,
      title: 'Home',
      subtitle: 'Back to main menu',
      icon: 'home-outline',
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
      id: 'history' as const,
      title: 'History',
      subtitle: 'View your progress',
      icon: 'stats-chart-outline',
      color: '#9B59B6',
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Invisible backdrop */}
      <Pressable 
        style={{ flex: 1 }}
        onPress={onClose}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.1)',
            opacity: opacityAnimation,
          }}
        />
      </Pressable>

      {/* Dropdown Menu Panel */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 80,
          right: 20,
          width: 280,
          transform: [
            { scale: scaleAnimation },
            { translateY: slideAnimation }
          ],
          opacity: opacityAnimation,
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 15,
          }}
        >
          {/* Menu Options */}
          {menuOptions.map((option, index) => (
            <Pressable
              key={option.id}
              onPress={() => handleOptionPress(option.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                borderRadius: 12,
                marginVertical: 2,
              }}
              android_ripple={{ color: '#F9FAFB' }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                  backgroundColor: `${option.color}15`,
                }}
              >
                <Ionicons name={option.icon as any} size={20} color={option.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: '#2C3E50',
                    fontSize: 16,
                    lineHeight: 20,
                    fontWeight: '600',
                    marginBottom: 2,
                  }}
                >
                  {option.title}
                </Text>
                <Text
                  style={{
                    color: '#7F8C8D',
                    fontSize: 12,
                    lineHeight: 16,
                  }}
                >
                  {option.subtitle}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#95A5A6" />
            </Pressable>
          ))}

          {/* Small footer */}
          <View style={{ 
            borderTopWidth: 1, 
            borderTopColor: '#F3F4F6', 
            marginTop: 8, 
            paddingTop: 12, 
            paddingHorizontal: 16 
          }}>
            <Text
              style={{
                color: '#95A5A6',
                fontSize: 10,
                lineHeight: 14,
                textAlign: 'center',
                letterSpacing: 0.5,
              }}
            >
              HEART DISEASE REVERSAL
            </Text>
          </View>
        </View>

        {/* Arrow pointer */}
        <View
          style={{
            position: 'absolute',
            top: -8,
            right: 24,
            width: 16,
            height: 16,
            backgroundColor: 'white',
            transform: [{ rotate: '45deg' }],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          }}
        />
      </Animated.View>
    </Modal>
  );
}