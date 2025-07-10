import React, { useState } from 'react';
import { View, Pressable, Animated, useRef, useEffect } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import ChatModal from './ChatModal';

interface FloatingChatButtonProps {
  // Optional props for customization
}

export default function FloatingChatButton({}: FloatingChatButtonProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Subtle pulse animation to draw attention
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Button press animation
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

    setIsChatOpen(true);
  };

  const handleClose = () => {
    setIsChatOpen(false);
  };

  return (
    <>
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 30,
          right: 20,
          zIndex: 1000,
          transform: [
            { scale: scaleAnimation },
            { scale: pulseAnimation }
          ],
        }}
      >
        <Pressable
          onPress={handlePress}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#16A085',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#16A085',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <Ionicons name="chatbubble" size={28} color="white" />
        </Pressable>
      </Animated.View>

      <ChatModal 
        visible={isChatOpen}
        onClose={handleClose}
      />
    </>
  );
}