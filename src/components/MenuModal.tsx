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
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Menu Panel */}
        <Animated.View
          style={{
            transform: [{ translateX: slideAnimation }],
            width: 320,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: { width: 2, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 10,
          }}
          className="flex-1"
        >
          <LinearGradient
            colors={['#FFFFFF', '#E8F6F3']}
            locations={[0, 1]}
            style={{ flex: 1 }}
          >
            <View style={{ flex: 1, paddingTop: 80, paddingHorizontal: 24 }}>
              {/* Header */}
              <View style={{ marginBottom: 32 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <Text
                    style={{
                      color: '#2C3E50',
                      fontSize: 28,
                      lineHeight: 34,
                      letterSpacing: -0.3,
                      fontWeight: 'bold',
                    }}
                  >
                    Menu
                  </Text>
                  <Pressable 
                    onPress={onClose} 
                    style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
                  >
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
              <View>
                {menuOptions.map((option, index) => (
                  <Pressable
                    key={option.id}
                    onPress={() => handleOptionPress(option.id)}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 16,
                      padding: 20,
                      marginBottom: 16,
                      shadowColor: option.color,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 24,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 16,
                          backgroundColor: `${option.color}15`,
                        }}
                      >
                        <Ionicons name={option.icon as any} size={24} color={option.color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            color: '#2C3E50',
                            fontSize: 18,
                            lineHeight: 24,
                            letterSpacing: -0.1,
                            fontWeight: '600',
                            marginBottom: 4,
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
              <View style={{ marginTop: 32, paddingTop: 24, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
                <Text
                  style={{
                    color: '#95A5A6',
                    fontSize: 12,
                    lineHeight: 16,
                    letterSpacing: 0.2,
                    textAlign: 'center',
                  }}
                >
                  Heart Disease Reversal Protocol
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Backdrop - Right side */}
        <Pressable 
          style={{ flex: 1 }}
          onPress={onClose}
        >
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              opacity: backdropAnimation,
            }}
          />
        </Pressable>
      </View>
    </Modal>
  );
}